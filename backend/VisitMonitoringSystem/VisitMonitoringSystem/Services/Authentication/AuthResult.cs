namespace VisitMonitoringSystem.Services.Authentication;

//3. Implement the registration functionality.

public record AuthResult(
    bool Success,
    string Email,
    string UserName,
    string Token
)
{
    //Error code - error message
    public readonly Dictionary<string, string> ErrorMessages = new();
}