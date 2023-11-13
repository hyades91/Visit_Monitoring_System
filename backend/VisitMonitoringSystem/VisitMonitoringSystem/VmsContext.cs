using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem;

public class VmsContext : IdentityDbContext<User, IdentityRole, string>
{
    public VmsContext(DbContextOptions<VmsContext> options) : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<User>().Property(e => e.Id).ValueGeneratedOnAdd();
    }
}