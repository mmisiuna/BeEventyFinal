using BeEventy.Data.Models;
using Microsoft.EntityFrameworkCore;
using PostgreSQL.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BeEventy.Data.Repositories
{
    public class TicketRepository
    {
        private readonly AppDbContext _context;

        public TicketRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Ticket>> GetAllTicketsAsync()
        {
            return await _context.Tickets.ToListAsync();
        }

        public async Task<List<Ticket>> GetAllTicketsByEventIdAsync(int eventId)
        {
            return await _context.Tickets.Where(t => t.EventId == eventId).ToListAsync();
        }

        public async Task<Ticket> GetTheCheapestTicketByEventIdAsync(int eventId)
        {
            return await _context.Tickets
                .Where(t => t.EventId == eventId)
                .OrderBy(t => t.Price)
                .FirstOrDefaultAsync();
        }
        public async Task<decimal?> GetLowestPriceByEventIdAsync(int eventId)
        {
            var ticket = await _context.Tickets
                                       .Where(t => t.EventId == eventId)
                                       .OrderBy(t => t.Price)
                                       .FirstOrDefaultAsync();
            return ticket?.Price;
        }

        public async Task AddTicketAsync(Ticket ticket)
        {
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTicketAsync(Ticket ticket)
        {
            _context.Tickets.Update(ticket);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTicketAsync(int ticketId)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket != null)
            {
                _context.Tickets.Remove(ticket);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Ticket> GetTicketByIdAsync(int ticketId)
        {
            return await _context.Tickets.FindAsync(ticketId);
        }
    }
}
