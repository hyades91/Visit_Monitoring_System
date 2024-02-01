using System.Timers;
using Timer = System.Threading.Timer;

namespace VisitMonitoringSystem.Services;

public class DatabaseUpdater
{
    private VmsContext _dbContext;
   
    private readonly Timer _timer;

    public DatabaseUpdater(VmsContext dbContext)
    {
        _dbContext = dbContext;

        // Állítsd be az időzítőt, például 10 percenként
        _timer = new Timer(OnTimerElapsed, null, 0, 10 * 60 * 1000); // 10 perc
    }

    private void OnTimerElapsed(object state)
    {
        // Itt végezd el az időzített lekérdezést vagy műveletet
        Console.WriteLine("Időzített lekérdezés végrehajtva");
            
        // Példa: Lekérdezés az adatbázisból
        var result = _dbContext.Stores.Count();
        if (result != null)
        {
            // Itt kezeld a lekérdezett eredményt
            Console.WriteLine("Eredmény: " + result + "db");
        }
    }
}