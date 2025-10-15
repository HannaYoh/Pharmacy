using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyApi.Data;

namespace PharmacyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _db;
        public SearchController(AppDbContext db) { _db = db; }

        // GET /api/search?medicine=paracetamol&lat=9.0&lng=38.7&radiusKm=5
        [HttpGet]
        public async Task<IActionResult> Search(string medicine, double lat, double lng, double radiusKm = 5)
        {
            // naive approach: join stock + pharmacy + medicine name filter
            var query = from s in _db.PharmacyStocks.Include(x => x.Medicine).Include(x => x.Pharmacy)
                        where s.Medicine.Name.Contains(medicine)
                        select new
                        {
                            s.PharmacyId,
                            s.MedicineId,
                            s.Medicine.Name,
                            s.Quantity,
                            s.Price,
                            PharmacyName = s.Pharmacy.Name,
                            s.Pharmacy.Latitude,
                            s.Pharmacy.Longitude
                        };

            var list = await query.ToListAsync();

            // Haversine distance filter
            double ToRad(double deg) => deg * Math.PI / 180.0;
            double Haversine(double lat1, double lon1, double lat2, double lon2)
            {
                var R = 6371.0; // km
                var dLat = ToRad(lat2 - lat1);
                var dLon = ToRad(lon2 - lon1);
                var a = Math.Sin(dLat/2)*Math.Sin(dLat/2) +
                        Math.Cos(ToRad(lat1)) * Math.Cos(ToRad(lat2)) *
                        Math.Sin(dLon/2)*Math.Sin(dLon/2);
                var c = 2*Math.Atan2(Math.Sqrt(a), Math.Sqrt(1-a));
                return R*c;
            }

            var results = list.Select(x =>
            {
                var dist = (x.Latitude.HasValue && x.Longitude.HasValue) ? Haversine(lat, lng, x.Latitude.Value, x.Longitude.Value) : double.MaxValue;
                return new {
                    x.PharmacyId, x.PharmacyName, x.MedicineId, x.Name, x.Quantity, x.Price, DistanceKm = dist
                };
            })
            .Where(r => r.DistanceKm <= radiusKm)
            .OrderBy(r => r.DistanceKm)
            .ToList();

            return Ok(results);
        }
    }
}
