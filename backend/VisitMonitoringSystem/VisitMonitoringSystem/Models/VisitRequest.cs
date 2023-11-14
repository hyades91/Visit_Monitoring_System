namespace VisitMonitoringSystem.Models;

public class VisitRequest
{
    public string Date { get; set; }
    public int StoreNumber { get; set; }
    public string StoreName { get; set; }
    public string Risk { get; set; }
    public string Type { get; set; }
}