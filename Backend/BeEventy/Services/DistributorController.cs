using BeEventy.Data.Models;
using BeEventy.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BeEventy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DistributorController : ControllerBase
    {
        private readonly DistributorRepository _distributorRepository;

        public DistributorController(DistributorRepository distributorRepository)
        {
            _distributorRepository = distributorRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Distributor>>> GetAllDistributors()
        {
            var distributors = await _distributorRepository.GetAllDistributorsAsync();
            return Ok(distributors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Distributor>> GetDistributorById(int id)
        {
            var distributor = await _distributorRepository.GetDistributorByIdAsync(id);
            if (distributor == null)
            {
                return NotFound();
            }
            return Ok(distributor);
        }

        [HttpPost]
        public async Task<ActionResult<Distributor>> AddDistributor(Distributor distributor)
        {
            await _distributorRepository.AddDistributorAsync(distributor);
            return CreatedAtAction(nameof(GetDistributorById), new { id = distributor.Id }, distributor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDistributor(int id, Distributor distributor)
        {
            if (id != distributor.Id)
            {
                return BadRequest("Distributor ID mismatch.");
            }

            await _distributorRepository.UpdateDistributorAsync(distributor);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDistributor(int id)
        {
            await _distributorRepository.DeleteDistributorAsync(id);
            return NoContent();
        }
    }
}
