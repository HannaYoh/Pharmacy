using Microsoft.AspNetCore.Identity;

namespace PharmacyApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
    }
}
