using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem.Services.Repositories;

public interface IStoreRepository
{
    IEnumerable<Store> GetAllStores();
    IEnumerable<Store> GetActiveStores();
    IEnumerable<Store> DeleteAllStores();
    IEnumerable<Store> SetToActivOrDeactiv(int StoreNumber);
    IEnumerable<Store> ChangeStoreRiskByNumber(int StoreNumber, int Risk);
    IEnumerable<Store> UpdateRisks();
}