using AdditionApi;
using AdditionApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdditionApi.Controllers
{
    [ApiController]
    [Route("number")]
    public class NumbersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public NumbersController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IEnumerable<NumberEntry>> GetAll()
        {
            return await _db.NumberEntries.OrderBy(n => n.Id).ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> Add(NumberEntry entry)
        {
            _db.NumberEntries.Add(entry);
            await _db.SaveChangesAsync();
            return Ok(entry);
        }

        [HttpDelete]
        public async Task<IActionResult> Clear()
        {
            _db.NumberEntries.RemoveRange(_db.NumberEntries);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
