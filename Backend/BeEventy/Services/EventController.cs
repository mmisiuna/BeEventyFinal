using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using BeEventy.Data.Models;
using BeEventy.Data.Repositories;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BeEventy.Data;
using System.Xml.Xsl;
using static BeEventy.Data.Models.Login;
using BeEventy.Data.Enums;
using System.IdentityModel.Tokens.Jwt;
using PostgreSQL.Data;
using Newtonsoft.Json;

namespace BeEventy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly EventRepository _eventRepository;
        private readonly AccountRepository _accountRepository;
        private readonly AppDbContext _context;

        public EventController(EventRepository eventRepository, AccountRepository accountRepository, AppDbContext context)
        {
            _eventRepository = eventRepository;
            _accountRepository = accountRepository;
            _context = context;
        }

        [HttpGet("getAllEvents")]
        public async Task<ActionResult<IEnumerable<Event>>> GetAllEvents()
        {
            var events = await _eventRepository.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpGet("id/{id}")]
        public async Task<ActionResult<Event>> GetEventById(int id)
        {
            var ev = await _eventRepository.GetEventByIdAsync(id);
            if (ev == null)
            {
                return NotFound();
            }
            return Ok(ev);
        }

        [HttpGet("name/{name}")]
        public async Task<ActionResult<Event>> GetEventByName(string name)
        {
            var ev = await _eventRepository.GetEventByNameAsync(name);
            if (ev == null)
            {
                return NotFound();
            }
            return Ok(ev);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Event>>> SearchEvents([FromQuery] string searchTerm)
        {
            var events = await _eventRepository.SearchEventsByNameAsync(searchTerm);
            return Ok(events);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, Event updatedEvent)
        {
            if (id != updatedEvent.Id)
            {
                return BadRequest("Event ID mismatch.");
            }

            var existingEvent = await _eventRepository.GetEventByIdAsync(id);
            if (existingEvent == null)
            {
                return NotFound("Event not found.");
            }

            await _eventRepository.UpdateEventAsync(updatedEvent);
            return NoContent();
        }

        [HttpPut("{id}/location")]
        public async Task<IActionResult> UpdateEventLocation(int id, [FromBody] Location newLocation)
        {
            var existingEvent = await _eventRepository.GetEventByIdAsync(id);
            if (existingEvent == null)
            {
                return NotFound("Event not found.");
            }

            existingEvent.Location = newLocation;
            await _eventRepository.UpdateEventLocationAsync(existingEvent);
            return NoContent();
        }
        [HttpPut("{id}/type")]
        public async Task<IActionResult> UpdateEventLType(int id, [FromBody] EventType newType)
        {
            var existingEvent = await _eventRepository.GetEventByIdAsync(id);
            if (existingEvent == null)
            {
                return NotFound("Event not found.");
            }

            existingEvent.EventType = newType;
            await _eventRepository.UpdateEventTypeAsync(existingEvent);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventById(int id)
        {
            await _eventRepository.DeleteEventAsync(id);
            return NoContent();
        }

        [HttpPost("{eventId}/plus")]
        public async Task<IActionResult> AddPlusToEvent(int eventId, [FromBody] LoginResponse loginResponse)
        {
            if (loginResponse == null || string.IsNullOrEmpty(loginResponse.Token) || loginResponse.UserId <= 0)
            {
                return BadRequest("Invalid request data.");
            }

            var handler = new JwtSecurityTokenHandler();
            try
            {
                var jsonToken = handler.ReadToken(loginResponse.Token) as JwtSecurityToken;
                if (jsonToken == null)
                {
                    return Unauthorized();
                }

                var success = await _eventRepository.AddPlusToEventAsync(eventId, loginResponse.UserId);
                if (success)
                {
                    var updatedEvent = await _eventRepository.GetEventByIdAsync(eventId);
                    return Ok(updatedEvent);
                }
                else
                {
                    return BadRequest("Nie udało się dodać plusa do wydarzenia.");
                }
            }
            catch (Exception ex)
            {
                return Unauthorized();
            }
        }

        [HttpPost("{eventId}/minus")]
        public async Task<IActionResult> AddMinusToEvent(int eventId, [FromBody] LoginResponse loginResponse)
        {
            if (loginResponse == null || string.IsNullOrEmpty(loginResponse.Token) || loginResponse.UserId <= 0)
            {
                return BadRequest("Invalid request data.");
            }

            var handler = new JwtSecurityTokenHandler();
            try
            {
                var jsonToken = handler.ReadToken(loginResponse.Token) as JwtSecurityToken;
                if (jsonToken == null)
                {
                    return Unauthorized();
                }

                var success = await _eventRepository.AddMinusToEventAsync(eventId, loginResponse.UserId);
                if (success)
                {
                    var updatedEvent = await _eventRepository.GetEventByIdAsync(eventId);
                    return Ok(updatedEvent);
                }
                else
                {
                    return BadRequest("Nie udało się dodać minusa do wydarzenia.");
                }
            }
            catch (Exception ex)
            {
                return Unauthorized();
            }
        }

        [HttpGet("sort/date")]
        public async Task<ActionResult<IEnumerable<Event>>> SortEventsByDate()
        {
            var sortedEvents = await _eventRepository.SortEventsByDateAsync();
            return Ok(sortedEvents);
        }

        [HttpGet("sort/closest")]
        public async Task<ActionResult<IEnumerable<Event>>> SortEventsByClosestDate()
        {
            var sortedEvents = await _eventRepository.SortEventsByClosestDateAsync();
            return Ok(sortedEvents);
        }

        [HttpGet("sort/votes")]
        public async Task<ActionResult<IEnumerable<Event>>> SortEventsByVotes()
        {
            var sortedEvents = await _eventRepository.SortEventsByVotesAsync();
            return Ok(sortedEvents);
        }

        [HttpGet("getAllValidEvents")]
        public async Task<ActionResult<IEnumerable<Event>>> SortValidEventsByDate()
        {
            var sortedEvents = await _eventRepository.GetAllValidEventsAsync();
            return Ok(sortedEvents);
        }

        [HttpGet("getEventsToVerify")]
        public async Task<ActionResult<IEnumerable<Event>>> GetEventsToVerify()
        {
            var sortedEvents = await _eventRepository.GetEventsToVerifyAsync();
            return Ok(sortedEvents);
        }

        [HttpGet("searchAndSort")]
        public async Task<ActionResult<IEnumerable<Event>>> SearchAndSortEvents([FromQuery] string searchTerm = "", [FromQuery] string sortType = "votes")
        {
            List<Event> events;

            if (string.IsNullOrEmpty(searchTerm))
            {
                // Jeśli searchTerm jest pusty, pobierz wszystkie ważne wydarzenia (lub wszystkie, zależnie od potrzeb)
                events = await _eventRepository.GetAllValidEventsAsync();
            }
            else
            {
                // Jeśli searchTerm jest obecny, przeszukaj wydarzenia
                events = await _eventRepository.SearchEventsByNameAsync(searchTerm);
            }

            // Sortowanie wyników
            switch (sortType)
            {
                case "date":
                    events = events.OrderBy(e => e.DateOfStart).ToList();
                    break;
                case "votes":
                    events = events.OrderByDescending(e => e.Pluses).ThenByDescending(e => e.Minuses).ToList();
                    break;
                case "closest":
                    var currentDate = DateTime.Now;
                    events = events.OrderBy(e => Math.Abs((e.DateOfStart - currentDate).Ticks)).ToList();
                    break;
                default:
                    events = events.OrderByDescending(e => e.Pluses).ThenByDescending(e => e.Minuses).ToList();
                    break;
            }

            return Ok(events);
        }

        [HttpGet("reportedEvents")]
        public async Task<ActionResult<IEnumerable<Event>>> GetEventsWithReports()
        {
            var events = await _eventRepository.GetEventsWithReportsAsync();
            return Ok(events);
        }

        [HttpGet("reportedEvents/byAccount/{accountId}")]
        public async Task<ActionResult<IEnumerable<Event>>> GetEventsReportedByUserAsync(int userId)
        {
            var events = await _eventRepository.GetEventsReportedByUserAsync(userId);
            return Ok(events);
        }
        
    [HttpPost("{eventId}/report")]
    public async Task<IActionResult> ReportEvent(int eventId, [FromBody] LoginResponse loginResponse)
    {
        if (loginResponse == null || string.IsNullOrEmpty(loginResponse.Token) || loginResponse.UserId <= 0)
        {
            return BadRequest("Invalid request data.");
        }

        var handler = new JwtSecurityTokenHandler();
        try
        {
            var jsonToken = handler.ReadToken(loginResponse.Token) as JwtSecurityToken;
            if (jsonToken == null)
            {
                return Unauthorized();
            }

            var success = await _eventRepository.AddReportToEventAsync(eventId, loginResponse.UserId);
            if (success)
            {
                var updatedEvent = await _eventRepository.GetEventByIdAsync(eventId);
                return Ok(updatedEvent);
            }
            else
            {
                return BadRequest("Nie udało się dodać zgłoszenia do wydarzenia.");
            }
        }
        catch (Exception ex)
        {
            return Unauthorized();
        }
    }

    [HttpPost("{eventId}/unreport")]
    public async Task<IActionResult> UnreportEvent(int eventId, [FromBody] LoginResponse loginResponse)
    {
        if (loginResponse == null || string.IsNullOrEmpty(loginResponse.Token) || loginResponse.UserId <= 0)
        {
            return BadRequest("Invalid request data.");
        }

        var handler = new JwtSecurityTokenHandler();
        try
        {
            var jsonToken = handler.ReadToken(loginResponse.Token) as JwtSecurityToken;
            if (jsonToken == null)
            {
                return Unauthorized();
            }

            var success = await _eventRepository.RemoveReportFromEventAsync(eventId, loginResponse.UserId);
            if (success)
            {
                var updatedEvent = await _eventRepository.GetEventByIdAsync(eventId);
                return Ok(updatedEvent);
            }
            else
            {
                return BadRequest("Nie udało się usunąć zgłoszenia z wydarzenia.");
            }
        }
        catch (Exception ex)
        {
            return Unauthorized();
        }
    }
        [HttpGet("{eventId}/lowestTicketPrice")]
        public async Task<ActionResult<decimal>> GetLowestTicketPrice(int eventId)
        {
            var lowestPrice = await _eventRepository.GetLowestTicketPriceAsync(eventId);
            return Ok(lowestPrice);
        }

        [HttpGet("{eventId}/highestTicketPrice")]
        public async Task<ActionResult<decimal>> GetHighestTicketPrice(int eventId)
        {
            var highestPrice = await _eventRepository.GetHighestTicketPriceAsync(eventId);
            return Ok(highestPrice);
        }

        [HttpPost("addEvent")]
        public async Task<IActionResult> AddEvent([FromBody] Event newEvent)
        {
            if (newEvent == null)
            {
                return BadRequest("Invalid event data.");
            }

            // Dodaj tutaj dodatkowe logi, aby zobaczyć, co jest nie tak
            Console.WriteLine("Received event: " + JsonConvert.SerializeObject(newEvent));

            try
            {
                _context.Events.Add(newEvent);
                await _context.SaveChangesAsync();
                return Ok(newEvent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("nextId")]
        public async Task<ActionResult<int>> GetNextEventId()
        {
            // Pobranie najwyższego Id z tabeli Events
            var maxId = await _context.Events.MaxAsync(e => (int?)e.Id) ?? 0;

            // Zwrócenie następnego dostępnego Id
            return Ok(maxId + 1);
        }


        [HttpGet("author/{eventId}")]
        public async Task<ActionResult<Account>> GetEventAuthor(int eventId)
        {
            var ev = await _eventRepository.GetEventByIdAsync(eventId);
            if (ev == null)
            {
                return NotFound("Event not found.");
            }

            var author = await _accountRepository.GetAccountByIdAsync(ev.AuthorId);
            if (author == null)
            {
                return NotFound("Author not found.");
            }

            return Ok(author);
        }
    }
}
