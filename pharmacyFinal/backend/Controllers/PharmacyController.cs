using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyApi.Data;
using PharmacyApi.Models;

namespace PharmacyApi.Controllers
{
   /*  [Route("api/[controller]")]
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
    } */
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "PharmacyOwner")] // Uncomment after Auth is implemented
    public class PharmacyController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PharmacyController(AppDbContext db) { _db = db; }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pharmacy newPharmacy)
        {
            // 1. TEMPORARY MOCK: Get Owner ID from the authenticated user.
            // In a real app, this ensures only the authenticated user is registered as the owner.
            // string? ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            string ownerId = "1"; 

            if (string.IsNullOrEmpty(ownerId))
            {
                return Unauthorized("Authentication token missing or invalid.");
            }
            
            // 2. SECURITY ENFORCEMENT (Mass Assignment Prevention):
            // We must forcefully overwrite these values that were potentially set by the client.
            newPharmacy.IsApproved = false; 
            newPharmacy.OwnerUserId = ownerId; 
            
            // Note: If the user sends an 'Id' in the JSON, Entity Framework will ignore it, 
            // but it's another reason DTOs are safer.

            // 3. Save to database
            _db.Pharmacies.Add(newPharmacy);
            await _db.SaveChangesAsync();
            
            // Return 201 Created status
            return CreatedAtAction(nameof(Create), new { id = newPharmacy.Id }, newPharmacy);
        }
    }
}
