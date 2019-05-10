using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using FinalGroupProject.Models;
using System;
using System.Net;
using Newtonsoft.Json;
using Google.Cloud.Speech.V1;
using static Google.Cloud.Speech.V1.RecognitionConfig.Types;
using System.Threading.Tasks;

namespace FinalGroupProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavLocationsController : ControllerBase {

        private readonly AppDbContext _context;
        public FavLocationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Groceries
        [HttpGet]
        public IEnumerable<FavLocation> GetFavLocation()
        {
            return _context.FavLocation;
        }

        // GET: api/Groceries/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFavLocation([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var FavLocation = await _context.FavLocation.FindAsync(id);

            if (FavLocation == null)
            {
                return NotFound();
            }

            return Ok(FavLocation);
        }

        // POST: api/FavLocations
        [HttpPost]
        public async Task<IActionResult> PostGrocery([FromBody] FavLocation favlocation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.FavLocation.Add(favlocation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFavLocation", new { id = favlocation.Id }, favlocation);
        }

        // DELETE: api/Groceries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGrocery([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var FavLocation = await _context.FavLocation.FindAsync(id);
            if (FavLocation == null)
            {
                return NotFound();
            }

            _context.FavLocation.Remove(FavLocation);
            await _context.SaveChangesAsync();

            return Ok(FavLocation);
        }

    }
}