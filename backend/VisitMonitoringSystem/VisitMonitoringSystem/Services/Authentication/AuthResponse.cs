namespace VisitMonitoringSystem.Services.Authentication;
//4.Implement the login functionality.
public record AuthResponse(string Email, string UserName, string Token);