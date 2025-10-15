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
    }
}
