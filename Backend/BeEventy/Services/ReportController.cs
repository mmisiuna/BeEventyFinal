using BeEventy.Data.Models;
using BeEventy.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BeEventy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly ReportRepository _reportRepository;
        private readonly EventRepository _eventRepository;

        public ReportController(ReportRepository reportRepository, EventRepository eventRepository)
        {
            _reportRepository = reportRepository;
            _eventRepository = eventRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReports()
        {
            var reports = await _reportRepository.GetAllReportsAsync();
            return Ok(reports);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReportById(int id)
        {
            var report = await _reportRepository.GetReportByIdAsync(id);
            if (report == null)
            {
                return NotFound();
            }
            return Ok(report);
        }

        [HttpPost]
        public async Task<IActionResult> AddReport([FromBody] Report report)
        {
            if (report == null)
            {
                return BadRequest();
            }

            await _reportRepository.AddReportAsync(report);
            return CreatedAtAction(nameof(GetReportById), new { id = report.Id }, report);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReport(int id, [FromBody] Report report)
        {
            if (id != report.Id || report == null)
            {
                return BadRequest();
            }

            await _reportRepository.UpdateReportAsync(report);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            await _reportRepository.DeleteReportAsync(id);
            return NoContent();
        }
        [HttpPost("report-event/{eventId}")]
        public async Task<IActionResult> ReportEventById(int eventId, int userID)
        {
            var eventExists = await _eventRepository.GetEventByIdAsync(eventId);
            if (eventExists == null)
            {
                return NotFound("Event not found.");
            }
                     var report = new Report
            {
                EventId = eventId,
            };

            report.EventId = eventId;

            await _reportRepository.AddReportAsync(report);

            return CreatedAtAction(nameof(GetReportById), new { id = report.Id }, report);
        }
    }
}
