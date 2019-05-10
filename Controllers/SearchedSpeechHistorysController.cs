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
    public class SearchedSpeechHistorysController : ControllerBase {

        private readonly AppDbContext _context;
        public SearchedSpeechHistorysController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Groceries
        [HttpGet]
        public IEnumerable<SearchedSpeechHistory> GetSearchedSpeechHistory()
        {
            return _context.SearchedSpeechHistory;
        }

        // GET: api/Groceries/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSearchedSpeechHistory([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var SearchedSpeechHistory = await _context.SearchedSpeechHistory.FindAsync(id);

            if (SearchedSpeechHistory == null)
            {
                return NotFound();
            }

            return Ok(SearchedSpeechHistory);
        }

        // POST: api/FavLocations
        [HttpPost]
        public async Task<IActionResult> PostGrocery([FromBody] SearchedSpeechHistory SearchedSpeechHistorydata)
        {
            SearchedSpeechHistorydata.RecordedDate = DateTime.Now;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.SearchedSpeechHistory.Add(SearchedSpeechHistorydata);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSearchedSpeechHistory", new { id = SearchedSpeechHistorydata.Id }, SearchedSpeechHistorydata);
        }

        // DELETE: api/Groceries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSearchedSpeechHistory([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var SearchedSpeechHistory = await _context.SearchedSpeechHistory.FindAsync(id);
            if (SearchedSpeechHistory == null)
            {
                return NotFound();
            }

            _context.SearchedSpeechHistory.Remove(SearchedSpeechHistory);
            await _context.SaveChangesAsync();

            return Ok(SearchedSpeechHistory);
        }

    }
}