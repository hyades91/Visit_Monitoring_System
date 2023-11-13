using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem.Services.Authentication;
//4.Implement the login functionality.
public class TokenService:ITokenService
{
    private const int ExpirationMinutes = 30;
    
    public string CreateToken(User user, string role)// "role"-> 5.Authorization
    {
        var expiration = DateTime.UtcNow.AddMinutes(ExpirationMinutes);
        var token = CreateJwtToken(
            CreateClaims(user , role),// "role"-> 5.Authorization
            CreateSigningCredentials(),
            expiration
        );
        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.WriteToken(token);
    }

    private JwtSecurityToken CreateJwtToken(List<Claim> claims, SigningCredentials credentials, DateTime expiration) =>
        new(
            "apiWithAuthBackend",
            "apiWithAuthBackend",
            claims,
            expires: expiration,
            signingCredentials: credentials
        );

    private List<Claim> CreateClaims(User user, string? role)// "role"-> 5.Authorization
    {
        try
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, "TokenForTheApiWithAuth"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString(CultureInfo.InvariantCulture)),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email)
            };

            if (role != null)// "role"-> 5.Authorization
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    private SigningCredentials CreateSigningCredentials()
    {
        return new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("!SomethingSecret")
            ),
SecurityAlgorithms.HmacSha256
        );
    }
}