namespace VisitMonitoringSystem.Services.Authentication;

//3. Implement the registration functionality.

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(string email, string username, string password, string role);// "role"-> 5.Authorization
    
    //4.Implement the login functionality.
    Task<AuthResult> LoginAsync(string username, string password, string role);// "role"-> 5.Authorization
}