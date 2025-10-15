using System.ComponentModel.DataAnnotations;

namespace PharmacyApi.Models
{
    public class Prescription
    {
        [Key]
        public int Id { get; set; }
        public string? CustomerUserId { get; set; }
        public int? PharmacyId { get; set; }
        public string? FilePath { get; set; }
        public string? OCRText { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
