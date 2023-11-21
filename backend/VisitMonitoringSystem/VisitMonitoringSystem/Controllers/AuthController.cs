using Microsoft.AspNetCore.Mvc;
using VisitMonitoringSystem.Contracts;
using VisitMonitoringSystem.Services.Authentication;
using VisitMonitoringSystem.Services.Repositories;
using Microsoft.AspNetCore.Authorization;
using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authenticationService;
    private readonly IUserRepository _userRepository;

    public AuthController(IAuthService authenticationService, IUserRepository userRepository)
    {
        _authenticationService = authenticationService;
        _userRepository = userRepository;
    }

    [HttpPost("Register")]
    public async Task<ActionResult<RegistrationResponse>> Register(RegistrationRequest request)
    {
        if (!ModelState.IsValid)
        {
            Console.WriteLine("ModelState: "+ModelState);
            return BadRequest(ModelState);
        }

        var result =
            await _authenticationService.RegisterAsync(request.Email, request.Username, request.Password, "User");// "role"-> 5.Authorization

        if (!result.Success)
        {
            AddErrors(result);
            return BadRequest(ModelState);
        }

        return CreatedAtAction(nameof(Register), new RegistrationResponse(result.Email, result.UserName));
    }

    private void AddErrors(AuthResult result)
    {
        foreach (var error in result.ErrorMessages)
        {
            ModelState.AddModelError(error.Key, error.Value);
            Console.WriteLine("ModelState.AddmodelError: "+ModelState.Root);
        }
    }
    //4.Implement the login functionality.
    [HttpPost("Login")]
    public async Task<ActionResult<AuthResponse>> Authenticate([FromBody] AuthRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authenticationService.LoginAsync(request.Email, request.Password, request.Email=="admin@admin.com"?"Admin":"User");// "admin@"-> 5.Authorization
        

        if (!result.Success )
        {
            AddErrors(result);
            return BadRequest(ModelState);
        }

        return Ok(new AuthResponse(result.Email, result.UserName, result.Token, _userRepository.GetByEmail(result.Email).HasAccess));
    }
    
    //CRUD
    [HttpGet("GetProfileData"), Authorize(Roles = "Admin , User")]
    public ActionResult <User> GetUserByEmail(string email)
    {
        try
        {
            return Ok(_userRepository.GetByEmail(email));
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
    
    [HttpPut("UpdateProfileData"), Authorize(Roles = "Admin , User")]
    public async Task<ActionResult <User>> UpdateProfile([FromBody] User user)
    {
        return Ok(_userRepository.UpdateUser(user.Email, user.UserName, user.FirstName, user.SecondName,
            user.PhoneNumber));
    }
}