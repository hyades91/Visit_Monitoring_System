namespace VisitMonitoringSystem.Models;

public class VisitRequest
{
    public string Visitdate { get; set; }
    public int StoreNumber { get; set; }
    public string StoreName { get; set; }
    public string Street { get; set; }
    public string RiskLevel { get; set; }
    public string Status { get; set; }
    public string Reason { get; set; }
}