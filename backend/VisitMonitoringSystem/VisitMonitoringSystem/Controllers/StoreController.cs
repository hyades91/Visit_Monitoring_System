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

    [HttpGet("GetAllStores")]
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
    [HttpGet("GetActiveStores")]
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

    [HttpDelete("DeleteAllStore")]
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

    [HttpPut("ChangeActivity")]
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
    
    [HttpPut("ChangeRisk")]
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

    [HttpPut("UpdateRisks")]
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