using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem.Services.Repositories;

public interface IVisitRepository
{
    IEnumerable<Visit> GetAll();
    IEnumerable<Visit> GetFinished();
    IEnumerable<Visit> DeleteAll();
    Task<int> AddAllJson(dynamic obj);
    Task<int> AddAll(IEnumerable<VisitRequest> ImportedVisits);
    Task<int> AddNewOnes(IEnumerable<VisitRequest> ImportedVisits);

  
    IEnumerable<Store> GetActiveStores();
    IEnumerable<Store> DeleteAllStores();
    public void UpdateStoreList();
}