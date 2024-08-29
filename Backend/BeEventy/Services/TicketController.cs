using BeEventy.Data.Models;
using BeEventy.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BeEventy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly TicketRepository _ticketRepository;

        public TicketController(TicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTickets()
        {
            var tickets = await _ticketRepository.GetAllTicketsAsync();
            return Ok(tickets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketById(int id)
        {
            var ticket = await _ticketRepository.GetTicketByIdAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }
            return Ok(ticket);
        }

        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetTicketsByEventId(int eventId)
        {
            var tickets = await _ticketRepository.GetAllTicketsByEventIdAsync(eventId);
            return Ok(tickets);
        }

        [HttpGet("cheapest/event/{eventId}")]
        public async Task<IActionResult> GetCheapestTicketByEventId(int eventId)
        {
            var ticket = await _ticketRepository.GetTheCheapestTicketByEventIdAsync(eventId);
            if (ticket == null)
            {
                return NotFound();
            }
            return Ok(ticket);
        }
        [HttpGet("lowest-price/event/{eventId}")]
        public async Task<IActionResult> GetLowestPriceByEventId(int eventId)
        {
            var price = await _ticketRepository.GetLowestPriceByEventIdAsync(eventId);
            if (price == null)
            {
                return NotFound();
            }
            return Ok(price);
        }

        [HttpPost]
        public async Task<IActionResult> AddTicket([FromBody] Ticket ticket)
        {
            if (ticket == null)
            {
                return BadRequest();
            }

            await _ticketRepository.AddTicketAsync(ticket);
            return CreatedAtAction(nameof(GetTicketById), new { id = ticket.Id }, ticket);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] Ticket ticket)
        {
            if (id != ticket.Id || ticket == null)
            {
                return BadRequest();
            }

            await _ticketRepository.UpdateTicketAsync(ticket);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            await _ticketRepository.DeleteTicketAsync(id);
            return NoContent();
        }
    }
}
