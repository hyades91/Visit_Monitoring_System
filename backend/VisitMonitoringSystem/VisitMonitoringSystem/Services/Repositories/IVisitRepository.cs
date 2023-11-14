using VisitMonitoringSystem.Models;

namespace VisitMonitoringSystem.Services.Repositories;

public interface IVisitRepository
{
    IEnumerable<Visit> GetAll();
    IEnumerable<Visit> DeleteAll();
    Task<int> AddAll(IEnumerable<VisitRequest> ImportedVisits);
}