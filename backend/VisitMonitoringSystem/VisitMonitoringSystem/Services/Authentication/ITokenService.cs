using Microsoft.AspNetCore.Identity;
using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem.Services.Authentication;
//4.Implement the login functionality.
public interface ITokenService
{
    public string CreateToken(User user, string role);// "role"-> 5.Authorization
}