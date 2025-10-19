using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PharmacyApi.Data;
using PharmacyApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// DB
var conn = builder.Configuration.GetConnectionString("DefaultConnection")
           ?? "Server=HANNA\\SQLEXPRESS;Database=pharmacy;Trusted_Connection=True;TrustServerCertificate=True;";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(conn));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? "ThisIsASuperStrongSecretKeyForPharmacyApi123456789!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "PharmacyApi";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtIssuer,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

// CORS for dev
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200") 
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// seed roles
using (var scope = app.Services.CreateScope())
{
    var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var roles = new[] { "Admin", "PharmacyOwner", "Customer" };
    foreach (var r in roles)
        if (!await roleMgr.RoleExistsAsync(r))
            await roleMgr.CreateAsync(new IdentityRole(r));
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
