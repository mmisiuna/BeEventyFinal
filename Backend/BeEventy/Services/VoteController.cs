using BeEventy.Data.Models;
using BeEventy.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BeEventy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoteController : ControllerBase
    {
        private readonly VoteRepository _voteRepository;

        public VoteController(VoteRepository voteRepository)
        {
            _voteRepository = voteRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVotes()
        {
            var votes = await _voteRepository.GetAllVotesAsync();
            return Ok(votes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVoteById(int id)
        {
            var vote = await _voteRepository.GetVoteByIdAsync(id);
            if (vote == null)
            {
                return NotFound();
            }
            return Ok(vote);
        }

        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetVotesByEventId(int eventId)
        {
            var votes = await _voteRepository.GetVotesByEventIdAsync(eventId);
            return Ok(votes);
        }

        [HttpPost]
        public async Task<IActionResult> AddVote([FromBody] Vote vote)
        {
            if (vote == null)
            {
                return BadRequest();
            }

            await _voteRepository.AddVoteAsync(vote);
            return CreatedAtAction(nameof(GetVoteById), new { id = vote.Id }, vote);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVote(int id, [FromBody] Vote vote)
        {
            if (id != vote.Id || vote == null)
            {
                return BadRequest();
            }

            await _voteRepository.UpdateVoteAsync(vote);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVote(int id)
        {
            await _voteRepository.DeleteVoteAsync(id);
            return NoContent();
        }
    }
}
