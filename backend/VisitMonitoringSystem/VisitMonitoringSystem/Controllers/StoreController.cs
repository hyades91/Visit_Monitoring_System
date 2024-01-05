using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using VisitMonitoringSystem.Models;
using VisitMonitoringSystem.Services;
using VisitMonitoringSystem.Services.Repositories;

namespace VisitMonitoringSystem.Controllers;

[ApiController]
[Route("[controller]")]
public class StoreController : ControllerBase
{
    private IStoreRepository _storeRepository;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public StoreController(IStoreRepository storeRepository, IWebHostEnvironment webHostEnvironment)
    {
        _storeRepository = storeRepository;
        _webHostEnvironment = webHostEnvironment;
    }

    [HttpGet("GetAllStores"), Authorize(Roles = "Admin , User")]
    public async Task<ActionResult<List<Store>>> GetAllStores()
    {
        try
        {
            return Ok(_storeRepository.GetAllStores());
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
    [HttpGet("GetActiveStores"), Authorize(Roles = "Admin , User")]
    public async Task<ActionResult<List<Store>>> GetStores()
    {
        try
        {
            return Ok(_storeRepository.GetActiveStores());
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    //Not used directly
    [HttpDelete("DeleteAllStore"), Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<Store>>> DeleteStores()
    {
        try
        {
            return Ok(_storeRepository.DeleteAllStores());
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    [HttpPut("ChangeActivity"), Authorize(Roles = "Admin , User")]
    public async Task<ActionResult<List<Store>>> ChangeActivity(int StoreNumber)
    {
        try
        {
            return Ok(_storeRepository.SetToActivOrDeactiv(StoreNumber));
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
    
    [HttpPut("ChangeRisk"), Authorize(Roles = "Admin , User")]
    public async Task<ActionResult<List<Store>>> ChangeRisk(int StoreNumber, int Risk)
    {
        try
        {
            return Ok(_storeRepository.ChangeStoreRiskByNumber(StoreNumber, Risk));
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    [HttpPut("UpdateRisks"), Authorize(Roles = "Admin , User")]
    public async Task<ActionResult<Store>> UpdateRisks()
    {
        try
        {
            return Ok(_storeRepository.UpdateRisks());
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}