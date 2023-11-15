using System.ComponentModel.DataAnnotations;

// 3. Implement the registration functionality.

namespace VisitMonitoringSystem.Contracts;

public record RegistrationRequest(
    [Required] string Email,
    [Required] string Username,
    [Required] string Password);