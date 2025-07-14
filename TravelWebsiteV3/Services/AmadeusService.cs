// Decompiled with JetBrains decompiler
// Type: TravelWebsiteV2.Services.AmadeusService
// Assembly: TravelWebsiteV2, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: AF945055-F85F-427D-8D76-44826C887B6A
// Assembly location: G:\TravelWebsiteV2\TravelWebsiteV2\TravelWebsiteV2.dll

using amadeus;
using amadeus.resources;
using Microsoft.Extensions.Configuration;
using resources.referenceData;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using TravelWebsiteV3.Pages;
using Location = amadeus.resources.Location;


namespace TravelWebsiteV3.Services
{
  public class AmadeusService
  {
    private readonly Amadeus _amadeus;
    private readonly IConfiguration _configuration;

    public AmadeusService(IConfiguration configuration)
    {
      this._configuration = configuration;
      this._amadeus = Amadeus.builder(this._configuration["Amadeus:ClientId"], this._configuration["Amadeus:ClientSecret"]).setHostname("test").setLoglevel("debug").build();
    }

    public async Task<FlightOffer[]> SearchFlights(
      string originLocationCode,
      string destinationLocationCode,
      DateTime departureDate,
      DateTime? returnDate = null,
      int adults = 1,
      int children = 0,
      string travelClass = "ECONOMY")
    {
      try
      {
        var parameters = Params.with(nameof(originLocationCode), originLocationCode)
            .and(nameof(destinationLocationCode), destinationLocationCode)
            .and(nameof(departureDate), departureDate.ToString("yyyy-MM-dd"))
            .and(nameof(adults), adults.ToString());
        if (returnDate.HasValue)
          parameters.and(nameof(returnDate), returnDate.Value.ToString("yyyy-MM-dd"));
        if (children > 0)
          parameters.and(nameof(children), children.ToString());
        if (!string.IsNullOrEmpty(travelClass))
          parameters.and(nameof(travelClass), travelClass);

        var offers = await Task.Run(() => _amadeus.shopping.flightOffersSearch.getFlightOffers(parameters));
        // Filter and order results
        var filtered = offers
            .Where(x => x.itineraries[0].segments.Last().arrival.iataCode == destinationLocationCode)
            .OrderBy(o => o.price.total)
            .Take(5)
            .ToArray();
        return filtered;
      }
      catch (Exception ex)
      {
        throw new Exception("Error searching flights", ex);
      }
    }

    public async Task<Location[]> SearchLocations(string keyword)
    {
      try
      {
        var parameters = Params.with(nameof(keyword), keyword).and("subType", Locations.CITY);
        var locations = await Task.Run(() => _amadeus.referenceData.locations.get(parameters));
        return locations;
      }
      catch (Exception ex)
      {
        throw new Exception("Error searching locations", ex);
      }
    }

    public async Task<Location[]> FindNearestAirport(double latitude, double longitude)
    {
      try
      {
        var parameters = Params.with(nameof(latitude), latitude.ToString("F2", CultureInfo.InvariantCulture))
            .and(nameof(longitude), longitude.ToString("F2", CultureInfo.InvariantCulture));
        var airports = await Task.Run(() => _amadeus.referenceData.locations.airports.get(parameters));
        var nearest = airports.OrderBy(a => a.distance.value).Take(4).ToArray();
        return nearest;
      }
      catch (Exception ex)
      {
        throw new Exception("Error finding nearest airport", ex);
      }
    }

    public async Task<FlightDestination[]> FindFlightInspirations(InspirationSearchRequest request)
    {
      try
      {
        var parameters = Params.with("origin", request.Origin);
        var inspirations = await Task.Run(() => _amadeus.shopping.flightDestinations.get(parameters));
        return inspirations;
      }
      catch (Exception ex)
      {
        throw new Exception("Error finding flight inspirations", ex);
      }
    }

    public async Task<IEnumerable<object>> GetPois(double latitude, double longitude)
    {
        try
        {
            var parameters = Params.with("latitude", latitude.ToString(System.Globalization.CultureInfo.InvariantCulture))
                .and("longitude", longitude.ToString(System.Globalization.CultureInfo.InvariantCulture))
                .and("radius", "20"); // 20km radius
           // var pois = await Task.Run(() => _amadeus.referenceData.locations.pointsOfInterest.get(parameters));
           var pois = await Task.Run(() => _amadeus.shopping.hotelOffers.get(parameters));
            return pois.Select(poi => new {
                name = poi.hotel,
                //latitude = poi.,
                // = poi.geoCode?.longitude,
                category = poi.type
            }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("Error fetching POIs", ex);
        }
    }
  }
}
