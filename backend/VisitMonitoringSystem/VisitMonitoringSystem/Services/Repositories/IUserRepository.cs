using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem.Services.Repositories;

public interface IUserRepository
{
    User GetByEmail(string email);

    User UpdateUser(string Email, string UserName, string FirstName, string SecondName, string PhoneNumber);
}