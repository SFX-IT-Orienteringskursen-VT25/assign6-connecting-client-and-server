using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdditionApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdditionApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdditionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdditionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Calculation>>> GetAll()
        {
            return await _context.Calculations.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Calculation>> Post(Calculation calculation)
        {
            calculation.Result = calculation.Operand1 + calculation.Operand2;

            calculation.Operation = $"{calculation.Operand1} + {calculation.Operand2} = {calculation.Result}";

            _context.Calculations.Add(calculation);

            await _context.SaveChangesAsync();

            return calculation;
        }

        [HttpDelete]
        public async Task<IActionResult> ClearHistory()
        {
            var allItems = _context.Calculations.ToList();

            if (allItems.Count == 0)
            {
                return Ok("Nothing to delete");
            }

            _context.Calculations.RemoveRange(allItems);

            await _context.SaveChangesAsync();

            return Ok("History cleared");
        }
    }
}