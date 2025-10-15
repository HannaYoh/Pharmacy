using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyApi.Data;
using PharmacyApi.Models;

namespace PharmacyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "PharmacyOwner,Admin")]
    public class PharmacyStockController : ControllerBase
    {
        private readonly AppDbContext _db;
        public PharmacyStockController(AppDbContext db) { _db = db; }

        [HttpGet("{pharmacyId}")]
        public async Task<IActionResult> GetStock(int pharmacyId)
        {
            var stock = await _db.PharmacyStocks
                .Include(s => s.Medicine)
                .Where(s => s.PharmacyId == pharmacyId)
                .ToListAsync();
            return Ok(stock);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] PharmacyStock stock)
        {
            stock.LastUpdated = DateTime.UtcNow;
            _db.PharmacyStocks.Add(stock);
            await _db.SaveChangesAsync();
            return Ok(stock);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PharmacyStock updated)
        {
            var stock = await _db.PharmacyStocks.FindAsync(id);
            if (stock == null) return NotFound();
            stock.Quantity = updated.Quantity;
            stock.Price = updated.Price;
            stock.LastUpdated = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(stock);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var s = await _db.PharmacyStocks.FindAsync(id);
            if (s == null) return NotFound();
            _db.PharmacyStocks.Remove(s);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
