using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem;

public class VmsContext : IdentityDbContext<User, IdentityRole, string>
{
    public DbSet<Visit> Visits  { get; set; }
    public VmsContext(DbContextOptions<VmsContext> options) : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<User>().Property(u => u.Id).ValueGeneratedOnAdd();
        builder.Entity<Visit>().Property(v => v.Id);
    }
}