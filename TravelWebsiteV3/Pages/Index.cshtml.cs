using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using TravelWebsiteV3.Services;
using amadeus.resources;
using System.Text.Json.Serialization;

namespace TravelWebsiteV3.Pages;

public class FlightSearchRequest
{
    [JsonPropertyName("originLocationCode")]
    public string OriginLocationCode { get; set; }

    [JsonPropertyName("destinationLocationCode")]
    public string DestinationLocationCode { get; set; }

    [JsonPropertyName("departureDate")]
    public DateTime DepartureDate { get; set; }

    [JsonPropertyName("returnDate")]
    public DateTime? ReturnDate { get; set; }

    [JsonPropertyName("adults")]
    public int Adults { get; set; }

    [JsonPropertyName("children")]
    public int Children { get; set; }

    [JsonPropertyName("travelClass")]
    public string TravelClass { get; set; }
}

public class InspirationSearchRequest
{
    public string Origin { get; set; }
    public string DepartureDate { get; set; }
    public string Duration { get; set; }
    public string MaxPrice { get; set; }
}

public class IndexModel : PageModel
{
    private readonly AmadeusService _amadeusService;
    private readonly ILogger<IndexModel> _logger;

    public IndexModel(AmadeusService amadeusService, ILogger<IndexModel> logger)
    {
        _amadeusService = amadeusService;
        _logger = logger;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnGetSearchLocations(string keyword)
    {
        try
        {
            var locations = await _amadeusService.SearchLocations(keyword);
            return new JsonResult(locations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching locations");
            return new JsonResult(new { error = "Error searching locations" }) { StatusCode = 500 };
        }
    }

    public async Task<IActionResult> OnGetFindNearestAirport(double latitude, double longitude)
    {
        try
        {
            
            var airports = await _amadeusService.FindNearestAirport(latitude, longitude);
            return new JsonResult(airports);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error finding nearest airport");
            return new JsonResult(new { error = "Error finding nearest airport" }) { StatusCode = 500 };
        }
    }

    public async Task<IActionResult> OnPostSearchFlights([FromBody] FlightSearchRequest request)
    {
        try
        {
            /*_logger.LogInformation("SearchFlights called with parameters: " +
                $"Origin: {request.OriginLocationCode}, " +
                $"Destination: {request.DestinationLocationCode}, " +
                $"Departure: {request.DepartureDate}, " +
                $"Return: {request.ReturnDate}, " +
                $"Adults: {request.Adults}, " +
                $"Children: {request.Children}, " +
                $"Class: {request.TravelClass}");*/

            var flights = await _amadeusService.SearchFlights(
                request.OriginLocationCode,
                request.DestinationLocationCode,
                request.DepartureDate,
                request.ReturnDate,
                request.Adults,
                request.Children,
                request.TravelClass
            );
            return new JsonResult(flights);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching flights");
            return new JsonResult(new { error = ex.Message }) { StatusCode = 500 };
        }
    }

    public async Task<IActionResult> OnPostSearchInspirationsAsync([FromBody] InspirationSearchRequest request)
    {
        if (request == null)
        {
            return BadRequest("Request is null");
        }

        try
        {
            var inspirations = await _amadeusService.FindFlightInspirations(request);
            return new JsonResult(inspirations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching for flight inspirations");
            return new JsonResult(new { error = "An error occurred while searching for flight inspirations." }) { StatusCode = 500 };
        }
    }

    public async Task<IActionResult> OnGetPois(double lat, double lng)
    {
        try
        {
            var pois = await _amadeusService.GetPois(lat, lng);
            return new JsonResult(pois);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching POIs");
            return new JsonResult(new { error = "Failed to fetch POIs" }) { StatusCode = 500 };
        }
    }
}