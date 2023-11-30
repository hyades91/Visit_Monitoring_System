using Microsoft.AspNetCore.Http.HttpResults;
using NPOI.SS.Formula.Functions;
using VisitMonitoringSystem.Models;
using Newtonsoft.Json;

namespace VisitMonitoringSystem.Services.Repositories;

public class StoreRepository:IStoreRepository
{
    private VmsContext _dbContext;
    public StoreRepository(VmsContext dbContext)
    {
        _dbContext = dbContext;
    }


    public IEnumerable<Store> GetAllStores()
    {
        var AllStores = _dbContext.Stores;
        return AllStores;
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

    public  IEnumerable<Store> SetToActivOrDeactiv(int StoreNumber)
    {

        var selectedStore = _dbContext.Stores.FirstOrDefault(store => store.StoreNumber == StoreNumber);
            {
                selectedStore.Active=(!selectedStore.Active);
                _dbContext.SaveChanges();
            }
            return _dbContext.Stores;

    }

    public IEnumerable<Store> ChangeStoreRiskByNumber(int StoreNumber, int Risk)
    {
        var selectedStore = _dbContext.Stores.FirstOrDefault(store => store.StoreNumber == StoreNumber);
        {
            selectedStore.Risk=Risk.ToString();
            _dbContext.SaveChanges();
        }
        return _dbContext.Stores;
    }

    public IEnumerable<Store> UpdateRisks()
    {
        throw new NotImplementedException();
    }
}