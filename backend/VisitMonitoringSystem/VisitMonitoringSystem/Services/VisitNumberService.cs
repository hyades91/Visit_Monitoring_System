using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VisitMonitoringSystem;

public class VisitNumberService : BackgroundService
{
    private readonly VmsContext _dbContext;

    public VisitNumberService(VmsContext dbContext)
    {
        _dbContext = dbContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Itt végezd el a lekérdezést
                var result = _dbContext.Visits.Count();
                // Kezelje a lekérdezés eredményét itt
                Console.WriteLine($"Result: {result}");

                // Várakozás 15 percig
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during query: {ex.Message}");
            }
        }
    }
}