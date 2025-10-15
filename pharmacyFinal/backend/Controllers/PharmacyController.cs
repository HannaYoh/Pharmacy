using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyApi.Data;
using PharmacyApi.Models;

namespace PharmacyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PharmacyController : ControllerBase
    {
        private readonly AppDbContext _db;
        public PharmacyController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _db.Pharmacies.ToListAsync());

        [Authorize(Roles = "PharmacyOwner")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pharmacy pharmacy)
        {
            _db.Pharmacies.Add(pharmacy);
            await _db.SaveChangesAsync();
            return Ok(pharmacy);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var p = await _db.Pharmacies.FindAsync(id);
            if (p == null) return NotFound();
            p.IsApproved = true;
            await _db.SaveChangesAsync();
            return Ok(p);
        }
    }
}
