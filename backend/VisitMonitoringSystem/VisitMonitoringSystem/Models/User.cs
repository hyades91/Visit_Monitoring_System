using Microsoft.AspNetCore.Identity;

namespace VisitMonitoringSystem.Models;

public class User:IdentityUser<string>
{
    public string? FirstName { get; set; }
    public string? SecondName { get; set; }

}