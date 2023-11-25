using Microsoft.AspNetCore.Http.HttpResults;
using NPOI.SS.Formula.Functions;
using VisitMonitoringSystem.Models;
using Newtonsoft.Json;

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
    
    public async Task<int> AddAllJson(dynamic obj)
    {
        foreach (var importedVisit in obj.payload)
            {
                Console.WriteLine(importedVisit.visitDate);
                var visit = new Visit
                {
                    Date = importedVisit.visitDate,
                    StoreNumber = importedVisit.storeNumber,
                    StoreName= importedVisit.storeName,
                    Risk = importedVisit.riskLevel,
                    Status = importedVisit.status,
                    Type = importedVisit.reason
                };
                await _dbContext.Visits.AddAsync(visit);
            }
            _dbContext.SaveChanges();
            UpdateStoreList();
            return _dbContext.Visits.Count();
            
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
         UpdateStoreList();
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
        UpdateStoreList();
        return _dbContext.Visits.Count();
    }


    
    public IEnumerable<Store> GetActiveStores()
    {
        var AllStores = _dbContext.Stores.Where(s=>s.Active==true);
        return AllStores;
    }


    public IEnumerable<Store> DeleteAllStores()
    {
        var AllStores = _dbContext.Stores;
        _dbContext.RemoveRange(AllStores);
        _dbContext.SaveChanges();
        return AllStores;
    }

    public void UpdateStoreList()
    {
        var visits = _dbContext.Visits.ToList();
       // var stores= _dbContext.Stores.ToList();
        foreach (var visit in visits)
        {
            //HA NEM TARTALMAZZA A LÁTOGATÁS BOLTSZÁMÁT
            if (!_dbContext.Stores.Select(store => store.StoreNumber).Contains(visit.StoreNumber))
            {
                var newStore = new Store
                {
                    StoreNumber = visit.StoreNumber,
                    StoreName = visit.StoreName,
                    Risk = visit.StoreNumber.ToString()[1].ToString() == "9" ?"4":visit.Risk, //mert a DC-nek nincs jól beállítva a TLT Portálon
                    Country = visit.StoreNumber.ToString()[0].ToString() == "1" ? "Czechia" :
                        visit.StoreNumber.ToString()[0].ToString() == "2" ? "Slovakia" : "Hungary",
                    Format = visit.StoreNumber.ToString()[1].ToString() == "1" ? "HM" :
                        visit.StoreNumber.ToString()[1].ToString() == "9" ? "DC" : "SF"
                };
                _dbContext.Stores.AddAsync(newStore);
                _dbContext.SaveChanges();
            }
        }
    }
    
}