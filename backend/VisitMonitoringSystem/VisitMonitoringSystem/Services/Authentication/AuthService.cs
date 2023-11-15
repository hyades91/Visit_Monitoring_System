using System.Xml.XPath;
using VisitMonitoringSystem.Controllers;
using Microsoft.AspNetCore.Identity;
using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem.Services.Authentication;

//3. Implement the registration functionality.

public class AuthService:IAuthService
{

    private readonly UserManager<User> _userManager;
    private readonly ITokenService _tokenService;//4.Implement the login functionality.

    public AuthService(UserManager<User> userManager ,ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;//4.Implement the login functionality.
    }


    public async Task<AuthResult> RegisterAsync(string email, string username, string password, string role)// "role"-> 5.Authorization
    {
        var user = new User { UserName = username, Email = email }; //IdentityUser helyett User-t írok
        var result = await _userManager.CreateAsync(user, password);
        Console.WriteLine("result:"+result);
        if (!result.Succeeded)
        {
            return FailedRegistration(result, email, username);
        }

        //await _userManager.AddToRoleAsync(user, role); //Adding the user to a role
        return new AuthResult(true, email, username, "");
    }
    
    private static AuthResult FailedRegistration(IdentityResult result, string email, string username)
    {
        var authResult = new AuthResult(false, email, username, "");
        foreach (var error in result.Errors)
        {
            authResult.ErrorMessages.Add(error.Code, error.Description);
        }

        Console.WriteLine("authResult:"+result);
        return authResult;
    }
    
    //4.Implement the login functionality.

    //role-t beleraktam 
    public async Task<AuthResult> LoginAsync(string email, string password, string role)// "role"-> 5.Authorization
    {
        var managedUser = await _userManager.FindByEmailAsync(email);

        if (managedUser == null)
        {
            return InvalidEmail(email);
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(managedUser, password);

        if (!isPasswordValid)
        {
            return InvalidPassword(email, managedUser.UserName);
        }
        
        //role-t beleraktam 
        var accessToken = _tokenService.CreateToken(managedUser, role);// "role"-> 5.Authorization

        return new AuthResult(true, managedUser.Email, managedUser.UserName, accessToken);
    }

    private static AuthResult InvalidEmail(string email)
    {
        var result = new AuthResult(false, email, "", "");
        result.ErrorMessages.Add("Bad credentials", "Invalid email");
        return result;
    }

    private static AuthResult InvalidPassword(string email, string userName)
    {
        var result = new AuthResult(false, email, userName, "");
        result.ErrorMessages.Add("Bad credentials", "Invalid password");
        return result;
    }
    
    
}