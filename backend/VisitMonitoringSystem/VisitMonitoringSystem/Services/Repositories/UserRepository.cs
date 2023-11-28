using VisitMonitoringSystem.Controllers;
using Microsoft.EntityFrameworkCore;
using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem.Services.Repositories;

public class UserRepository : IUserRepository
{

    private readonly VmsContext dbContext;

    public UserRepository(VmsContext dbContext_)
    {
        dbContext = dbContext_;
    }

    public User GetByEmail(string Email)
    {
        var CopiedUser=new User();
        var SelectedUser = dbContext.Users.FirstOrDefault(u => u.Email == Email);
        
        
        CopiedUser.UserName = SelectedUser.UserName;
        CopiedUser.FirstName = SelectedUser.FirstName;
        CopiedUser.SecondName = SelectedUser.SecondName;
        CopiedUser.Email = SelectedUser.Email;
        CopiedUser.PhoneNumber = SelectedUser.PhoneNumber;
        CopiedUser.HasAccess =SelectedUser.HasAccess;
            
        return CopiedUser;
    }
    
    public User UpdateUser(string Email, string UserName, string FirstName, string SecondName)
    {

        var SelectedUser = dbContext.Users.FirstOrDefault(u => u.Email == Email);
        
        
        SelectedUser.UserName = UserName;
        SelectedUser.FirstName = FirstName;
        SelectedUser.SecondName = SecondName;

        dbContext.SaveChanges();
        
        //Nem akarom átadni az adatokat
        return GetByEmail(Email);
    }
    
}