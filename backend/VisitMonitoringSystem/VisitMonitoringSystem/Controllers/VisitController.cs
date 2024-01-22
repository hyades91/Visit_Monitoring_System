using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
    //
    [HttpGet("GetAllVisit"), Authorize(Roles = "Admin ")]
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
    
    [HttpGet("GetFinishedVisit"), Authorize(Roles = "Admin , User")]
    public async Task<ActionResult<List<Visit>>> GetFinishedVisits()
    {
        try
        {
            return Ok(_visitrepository.GetFinished());
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    [HttpDelete("DeleteAllVisit"), Authorize(Roles = "Admin ")]
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
/*
    [HttpPost("ResetAllVisitWithJsonLink")]
    [DisableRequestSizeLimit]
    public async Task<ActionResult> UploadJson()
    {
        var url = "     ";
        try
        {
            _visitrepository.DeleteAll();

            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    // A JSON fájl tartalmának beolvasása
                    var jsonContent = await response.Content.ReadAsStringAsync();


                    // JSON deszerializálása objektummá
                    var obj = JsonConvert.DeserializeObject<dynamic>(jsonContent);

                    return Ok(_visitrepository.AddAllJson(obj));
                }
                else
                {
                    return BadRequest("Nem sikerült letölteni a JSON tartalmat.");
                }
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

    }

  */
    
    [HttpPost("ResetAllVisitWithJson"), Authorize(Roles = "Admin ")]
    [DisableRequestSizeLimit]
    public async Task<ActionResult> UploadJson(IFormFile file)
    {
        try
        {
            _visitrepository.DeleteAll();
        
        /* LOCAL FÁJL BEOLVASÁSA
            string filePath = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot/uploads", "all_visits2023_11_15.json");
        
            // A JSON fájl beolvasása
            string jsonContent = System.IO.File.ReadAllText(filePath);
        */

        if (file != null && file.Length > 0)
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0;
                    
                    using (var reader = new StreamReader(stream))
                    {
                        // A JSON fájl tartalmának beolvasása
                        string jsonContent = await reader.ReadToEndAsync();

                        // JSON deszerializálása objektummá
                        var obj = JsonConvert.DeserializeObject<dynamic>(jsonContent);

                        return Ok(_visitrepository.AddAllJson(obj));
                    }
                }
            }
            else
            {
                return BadRequest("Nincs fájl feltöltve.");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
      
    }
    
    [HttpPost("ResetAllVisitWithJsonObj"), Authorize(Roles = "Admin ")]
    [DisableRequestSizeLimit]
    public async Task<ActionResult> UploadJson()
    {
        try
        {

            using (StreamReader reader = new StreamReader(Request.Body))
            {
                string jsonContent = await reader.ReadToEndAsync();
                var obj = JsonConvert.DeserializeObject<dynamic>(jsonContent);
                _visitrepository.DeleteAll();
                return Ok(_visitrepository.AddAllJson(obj));
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
      
    }
    
    
    [HttpPost("AddVisitsWithExcel"), Authorize(Roles = "Admin ")]
    [DisableRequestSizeLimit]
    public async Task<ActionResult> Upload(IFormFile formFile)
    {
        // A fájl tartalmának kinyerése Stream-be
        using var stream = formFile.OpenReadStream(); // Módosítás: Stream kinyerése az IFormFile-ból

        var importedVisits = ExcelHelper.Import<VisitRequest>(stream);

       // Console.WriteLine(importedVisits[0].Visitdate);
    
        // ... további műveletek a betöltött adatokkal ...

        return Ok(_visitrepository.AddAll(importedVisits));
    }

    [HttpPost("AddOnlyNewVisitsWithExcel"), Authorize(Roles = "Admin ")]
    [DisableRequestSizeLimit]
    public async Task<ActionResult> UploadNew(IFormFile formFile)
    {
        // A fájl tartalmának kinyerése Stream-be
        using var stream = formFile.OpenReadStream(); // Módosítás: Stream kinyerése az IFormFile-ból

        var importedVisits = ExcelHelper.Import<VisitRequest>(stream);

       // Console.WriteLine(importedVisits[0].Visitdate);
    
        // ... további műveletek a betöltött adatokkal ...

        return Ok(_visitrepository.AddNewOnes(importedVisits));

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