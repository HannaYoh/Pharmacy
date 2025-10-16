using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyApi.Data;
using PharmacyApi.Models;

namespace PharmacyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicineController : ControllerBase
    {
        private readonly AppDbContext _db;
        public MedicineController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _db.Medicines.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Medicine m)
        {
            _db.Medicines.Add(m);
            await _db.SaveChangesAsync();
            return Ok(m);
        }

        // NEW: UPDATE METHOD
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Medicine m)
        {
            var existing = await _db.Medicines.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = m.Name;
            existing.GenericName = m.GenericName;
            existing.Manufacturer = m.Manufacturer;
            existing.Description = m.Description;

            await _db.SaveChangesAsync();
            return Ok(existing);
        }

        // NEW: DELETE METHOD
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var medicine = await _db.Medicines.FindAsync(id);
            if (medicine == null) return NotFound();

            _db.Medicines.Remove(medicine);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
