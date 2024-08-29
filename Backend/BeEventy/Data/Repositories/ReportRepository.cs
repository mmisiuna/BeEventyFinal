using BeEventy.Data.Models;
using Microsoft.EntityFrameworkCore;
using PostgreSQL.Data;

namespace BeEventy.Data.Repositories
{
    public class ReportRepository
    {
        private readonly AppDbContext _context;

        public ReportRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Report>> GetAllReportsAsync()
        {
            return await _context.Reports.ToListAsync();
        }

        public async Task<List<Report>> GetReportsByEventIdAsync(int eventId)
        {
            return await _context.Reports.Where(r => r.EventId == eventId).ToListAsync();
        }

        public async Task AddReportAsync(Report report)
        {
            _context.Reports.Add(report);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateReportAsync(Report report)
        {
            _context.Reports.Update(report);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteReportAsync(int reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report != null)
            {
                _context.Reports.Remove(report);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Report> GetReportByIdAsync(int reportId)
        {
            return await _context.Reports.FindAsync(reportId);
        }
    }
}
