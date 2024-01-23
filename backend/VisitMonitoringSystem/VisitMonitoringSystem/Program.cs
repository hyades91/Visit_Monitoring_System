using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using VisitMonitoringSystem;
using VisitMonitoringSystem.Models;
using VisitMonitoringSystem.Services;
using VisitMonitoringSystem.Services.Authentication;
using VisitMonitoringSystem.Services.Repositories;

var builder = WebApplication.CreateBuilder(args);

//Appsetting használatához
var configuration = new ConfigurationBuilder()
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json").Build();



AddServices();// Add services to the container.
AddAuthentication();//1. Secure the endpoints
AddDbContext();//2. Setting up identity
AddIdentity();//3.Implement the registration functionality.
ConfigureSwagger();//4.Implement the login functionality.

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseCors(x => x.AllowAnyHeader()
    .AllowAnyMethod().WithOrigins("https://vms-client.onrender.com","http://localhost:3000"));





app.UseAuthentication();//1. Secure the endpoints
app.UseAuthorization();

app.MapControllers();

AddRoles();//5.Authorization
AddAdmin();//5.Authorization

app.Run();

void AddServices()
{

    builder.Services.AddControllers();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddScoped<IAuthService, AuthService>(); //3.Implement the registration functionality.
    builder.Services.AddScoped<ITokenService, TokenService>(); //4.Implement the login functionality.

    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IVisitRepository, VisitRepository>();
    builder.Services.AddScoped<IStoreRepository, StoreRepository>();
 
    
    builder.Services.AddCors();//FOR REACT FETCHES
  
}

void AddAuthentication() //1. Secure the endpoints
{
    //set up an authentication scheme
    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            
            var appsettings = configuration.GetSection("AppSettings");
            var ValidIssuer = appsettings["ValidIssuer"];
            var ValidAudience = appsettings["ValidAudience"];
            //var issuerSigningKey = builder.Configuration["UserSecrets: IssuerSigningKey"]; //USERSECRET
            var issuerSigningKey=Environment.GetEnvironmentVariable("IssuerSigningKey"); //RENDER
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ClockSkew = TimeSpan.Zero,
                ValidateIssuer = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = ValidIssuer,
                ValidAudience = ValidAudience,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(issuerSigningKey)
                ),
            };
        });
}

void AddDbContext() //2. Setting up identity
{
    //1- User-secret
    //var connectionString = builder.Configuration["UserSecrets: ConnectionString"];
   
    //2- Environmental Variable
    var connectionString = Environment.GetEnvironmentVariable("ConnectionString");

    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("connectionString nincs beállítva.");
    }
    
    
    
    builder.Services.AddDbContextFactory<VmsContext>(options =>
        //options.UseSqlServer(connectionString)); //1. Local server
        options.UseNpgsql(connectionString)); //2. Render postgresql
       
}

void AddIdentity(){ //3.Implement the registration functionality.
    
//we have to configure the UserManager in theAuthService and make sure that it has a connection to thedatabase
    builder.Services.AddIdentityCore<User>(options =>
        {
            options.SignIn.RequireConfirmedAccount = false;
            options.User.RequireUniqueEmail = true;
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;
            //last line specifies the context, (the connection to the database), where your users' information will be handled and stored.
        })
        .AddRoles<IdentityRole>() //Enable Identity Role
        .AddEntityFrameworkStores<VmsContext>();

}

void ConfigureSwagger() //4.Implement the login functionality. Authorize button
{
    builder.Services.AddSwaggerGen(option =>
    {
        option.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "JewelryWebshop",
            Version = "v1"
        });

        option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter a valid token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",

            Scheme = "Bearer"
        });

        option.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }
        });
    });
}
void AddRoles()//5.Authorization
{
    using var scope = app.Services.CreateScope();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    var tAdmin = CreateAdminRole(roleManager);
    tAdmin.Wait();

    var tUser = CreateUserRole(roleManager);
    tUser.Wait();
}

async Task CreateAdminRole(RoleManager<IdentityRole> roleManager)
{
    await roleManager.CreateAsync(new IdentityRole("Admin"));
    // The role string should better be stored as a constant or a value in appsettings
}

async Task CreateUserRole(RoleManager<IdentityRole> roleManager)
{
    await roleManager.CreateAsync(new IdentityRole("User"));
    // The role string should better be stored as a constant or a value in appsettings
}
//To add an admin,
void AddAdmin()
{
    var tAdmin = CreateAdminIfNotExists();
    tAdmin.Wait();
}

async Task CreateAdminIfNotExists()
{
    using var scope = app.Services.CreateScope();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

    var AdminMailString = Environment.GetEnvironmentVariable("AdminMailString");
    var adminInDb = await userManager.FindByEmailAsync(AdminMailString);

    if (adminInDb == null)
    {
        var admin = new User
        {
            UserName = "admin",
            Email = AdminMailString,
            HasAccess=true
        };
        var AdminString = Environment.GetEnvironmentVariable("AdminString");
        var adminCreated = await userManager.CreateAsync(admin, AdminString);
        
        if (adminCreated.Succeeded)
        {
            await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
}