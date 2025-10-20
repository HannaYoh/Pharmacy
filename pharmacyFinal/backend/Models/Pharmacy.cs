using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PharmacyApi.Models
{
    public class Pharmacy
    {
        [Key]
        public int Id { get; set; }

        [Required] public string Name { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? LicenseNumber { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public bool IsApproved { get; set; } = false;

        public string? OwnerUserId { get; set; } = "1";
    }
}
