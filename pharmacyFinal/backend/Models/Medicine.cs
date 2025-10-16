using System.ComponentModel.DataAnnotations;

namespace PharmacyApi.Models
{
    public class Medicine
    {
        [Key]
        public int Id { get; set; }
        [Required] public string? Name { get; set; }
        public string? GenericName { get; set; }
        public string? Manufacturer { get; set; }
        public string? Description { get; set; }
    }
}
