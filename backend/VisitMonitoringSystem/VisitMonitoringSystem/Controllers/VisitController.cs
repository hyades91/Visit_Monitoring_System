using Microsoft.AspNetCore.Mvc;
using VisitMonitoringSystem.Models;
using VisitMonitoringSystem.Services;
using VisitMonitoringSystem.Services.Repositories;

namespace VisitMonitoringSystem.Controllers;

[ApiController]
[Route("[controller]")]
public class VisitController : ControllerBase
{
    private IVisitRepository _visitrepository;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public VisitController(IVisitRepository visitrepository, IWebHostEnvironment webHostEnvironment)
    {
        _visitrepository = visitrepository;
        _webHostEnvironment = webHostEnvironment;
    }

    //CRUD...
    [HttpGet("GetAllVisit")]
    public async Task<ActionResult<List<Visit>>> GetVisits()
    {
        try
        {
            return Ok(_visitrepository.GetAll());
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    [HttpDelete("DeleteAllVisit")]
    public async Task<ActionResult<List<Visit>>> DeleteVisits()
    {
        try
        {
            return Ok(_visitrepository.DeleteAll());
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    [HttpPost("upload")]
    [DisableRequestSizeLimit]
    public async Task<ActionResult> Upload(IFormFile formFile)
    {
       // if (formFile.File.Count == 0) return NoContent();

        //var file = Request.Form.Files[0];
        var filePath = SaveFile(formFile);

        // load product requests from excel file
        var importedVisits = ExcelHelper.Import<VisitRequest>(filePath);

        Console.WriteLine(importedVisits[0].Date);
        
        // save product requests to database
        return Ok(_visitrepository.AddAll(importedVisits));

    }

    // save the uploaded file into wwwroot/uploads folder
    private string SaveFile(IFormFile file)
    {
        if (file.Length == 0)
        {
            throw new BadHttpRequestException("File is empty.");
        }

        var extension = Path.GetExtension(file.FileName);

        var webRootPath = _webHostEnvironment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        }

        var folderPath = Path.Combine(webRootPath, "uploads");
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        var fileName = $"{Guid.NewGuid()}.{extension}";
        var filePath = Path.Combine(folderPath, fileName);
        using var stream = new FileStream(filePath, FileMode.Create);
        file.CopyTo(stream);

        return filePath;

    }
}