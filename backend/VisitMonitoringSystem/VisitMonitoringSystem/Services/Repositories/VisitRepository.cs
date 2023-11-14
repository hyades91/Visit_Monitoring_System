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
    
    public IEnumerable<Visit> GetFinished()
    {
        var AllVisits = _dbContext.Visits.Where(v=>v.Status=="Finished");
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
            Console.WriteLine(importedVisit.Visitdate);
            var visit = new Visit
            {
                Date = importedVisit.Visitdate,
                StoreNumber = importedVisit.StoreNumber,
                StoreName= importedVisit.StoreName,
                Risk = importedVisit.RiskLevel,
                Status = importedVisit.Status,
                Type = importedVisit.Reason
            };
            await _dbContext.Visits.AddAsync(visit);
        }
         _dbContext.SaveChanges();

        return _dbContext.Visits.Count();
    }

    public async Task<int> AddNewOnes(IEnumerable<VisitRequest> ImportedVisits)
    {
        foreach (var importedVisit in ImportedVisits)
        {
            Console.WriteLine(importedVisit.Visitdate);
            var visit = new Visit
            {
                Date = importedVisit.Visitdate,
                StoreNumber = importedVisit.StoreNumber,
                StoreName= importedVisit.StoreName,
                Risk = importedVisit.RiskLevel,
                Status = importedVisit.Status,
                Type = importedVisit.Reason
            };
            
            //ADD ONLY If our database does not contain it
            var VisitInTheSameTime = _dbContext.Visits.Where(v => v.Date == visit.Date);
            //  There is no visit in database with the same time 
            if (VisitInTheSameTime.Count()==0)
            {
                await _dbContext.Visits.AddAsync(visit);
            }
            //|OR| there is/are, but with another StoreNumber
            else if(!VisitInTheSameTime.Select(v=>v.StoreNumber).Contains(visit.StoreNumber))
            {
                await _dbContext.Visits.AddAsync(visit);
            }
        }
        _dbContext.SaveChanges();

        return _dbContext.Visits.Count();
    }
}