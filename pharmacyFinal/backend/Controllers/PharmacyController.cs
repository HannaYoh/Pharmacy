using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyApi.Data;
using PharmacyApi.Models;
using System.Linq; // Needed for .Where() (new)

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

        //new
        [HttpGet("pending")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPending()
        {
            // Fetch pharmacies where IsApproved is false
            // Note: If you have a User model, you'd want to use .Include() to get the Owner's name.
            var pendingList = await _db.Pharmacies
                .Where(p => p.IsApproved == false)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.LicenseNumber,
                    // MOCKING Owner name until User model and relationships are fully set up
                    Owner = $"Owner-{p.OwnerUserId}"
                })
                .ToListAsync();

            return Ok(pendingList);
        }

        // Endpoint 2: Approve or Deny a Pharmacy (Update Status)
        // We'll use a single PUT endpoint for both, taking the desired status in the body.
        [HttpPut("{id}/status")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] bool status)
        {
            var pharmacy = await _db.Pharmacies.FindAsync(id);

            if (pharmacy == null) return NotFound("Pharmacy not found.");

            // Set the IsApproved status based on the received boolean value
            pharmacy.IsApproved = status;

            // Note: If status is false (denial), you might also want to delete the entry 
            // or add a 'IsDenied' field. For simplicity, we just set IsApproved = false/true.

            await _db.SaveChangesAsync();
            return Ok(new { Message = $"Pharmacy ID {id} status updated to {status}", Pharmacy = pharmacy });
        }

        //new
        /// <summary>
        /// CUSTOMER SEARCH 1: Find approved pharmacies by name (partial match) from the Pharmacy table.
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchPharmacies([FromQuery] string? name)
        {
            var query = _db.Pharmacies.AsQueryable();

            // Filter by name if a search term is provided
            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(p => p.Name.ToLower().Contains(name.ToLower()));
            }

            // Only return pharmacies that have been approved by the Admin
            var results = await query
                .Where(p => p.IsApproved == true)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Address,
                    p.Phone,
                    p.Latitude,
                    p.Longitude
                })
                .ToListAsync();

            return Ok(results);
        }


        /// <summary>
        /// CUSTOMER SEARCH 2: Find medicines by name (partial match) from the Medicine table.
        /// </summary>
        [HttpGet("search/medicine")]
        public async Task<IActionResult> SearchMedicinesByName([FromQuery] string? medicineName)
        {
            if (string.IsNullOrEmpty(medicineName))
            {
                return BadRequest("Medicine name is required for searching.");
            }

            // Query the Medicines table directly
            var results = await _db.Medicines
                .Where(m => m.Name.ToLower().Contains(medicineName.ToLower()))
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    m.Manufacturer,
                    m.Description
                })
                .ToListAsync();

            return Ok(results);
        }


       
        

    }
}
