using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VisitMonitoringSystem;

public class VisitNumberService : BackgroundService
{
    private readonly VmsContext _dbContext;

    Random Random = new Random();
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
                int result = _dbContext.Visits.Count();
                // Kezelje a lekérdezés eredményét itt
                Console.WriteLine($"Result: {result}");
                var rnd = Random.Next(500, 700);
                // Várakozás 15 percig
                await Task.Delay(TimeSpan.FromSeconds(rnd), stoppingToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during query: {ex.Message}");
            }
        }
    }
}