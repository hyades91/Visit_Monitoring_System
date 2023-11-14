using Microsoft.AspNetCore.Http.HttpResults;
using NPOI.SS.Formula.Functions;
using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem.Services.Repositories;

public class VisitRepository:IVisitRepository
{
    private VmsContext _dbContext;
    public VisitRepository(VmsContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IEnumerable<Visit> GetAll()
    {
        var AllVisits = _dbContext.Visits.ToList();
        return AllVisits;
    }

    public IEnumerable<Visit> DeleteAll()
    {
        var AllVisits = _dbContext.Visits;
        _dbContext.RemoveRange(AllVisits);
        _dbContext.SaveChanges();
        return AllVisits;
    }

    public async Task<int> AddAll(IEnumerable<VisitRequest> ImportedVisits)
    {
        foreach (var importedVisit in ImportedVisits)
        {
            Console.WriteLine(importedVisit.Date);
            var visit = new Visit
            {
                Date = importedVisit.Date,
                StoreNumber = importedVisit.StoreNumber,
                StoreName= importedVisit.StoreName,
                Risk = importedVisit.Risk,
                Type = importedVisit.Type
            };
            await _dbContext.Visits.AddAsync(visit);
        }
         _dbContext.SaveChanges();

        return _dbContext.Visits.Count();
    }
}