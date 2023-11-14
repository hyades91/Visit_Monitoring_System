namespace VisitMonitoringSystem.Models;

public class Visit
{
    public int? Id { get; set; }
    public string Date { get; set; }
    public int StoreNumber { get; set; }
    public string StoreName { get; set; }
    public string Risk { get; set; }
    public string Type { get; set; }
}