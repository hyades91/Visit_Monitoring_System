namespace VisitMonitoringSystem.Models;

public class Store
{
    public int Id { get; set; }
    public int StoreNumber { get; set; }
    public string StoreName { get; set; }
    public string Risk { get; set; }
    public string Country { get; set; }
    public string Format { get; set; }
    public bool Active { get; set; } = true;
}