using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PharmacyApi.Models
{
    public class PharmacyStock
    {
        [Key]
        public int Id { get; set; }

        [Required] public int PharmacyId { get; set; }
        [ForeignKey("PharmacyId")]
        public Pharmacy Pharmacy { get; set; }

        [Required] public int MedicineId { get; set; }
        [ForeignKey("MedicineId")]
        public Medicine Medicine { get; set; }

        [Required] public int Quantity { get; set; }
        [Required] public decimal Price { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}
