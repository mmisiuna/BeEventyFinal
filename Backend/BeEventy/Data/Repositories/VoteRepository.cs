using BeEventy.Data.Models;
using Microsoft.EntityFrameworkCore;
using PostgreSQL.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BeEventy.Data.Repositories
{
    public class VoteRepository
    {
        private readonly AppDbContext _context;

        public VoteRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Vote>> GetAllVotesAsync()
        {
            return await _context.Votes.ToListAsync();
        }

        public async Task<List<Vote>> GetVotesByEventIdAsync(int eventId)
        {
            return await _context.Votes.Where(v => v.EventId == eventId).ToListAsync();
        }

        public async Task<List<Vote>> GetVotesByUserIdAsync(int userId)
        {
            return await _context.Votes.Where(v => v.UserId == userId).ToListAsync();
        }

        public async Task AddVoteAsync(Vote vote)
        {
            _context.Votes.Add(vote);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateVoteAsync(Vote vote)
        {
            _context.Votes.Update(vote);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteVoteAsync(int voteId)
        {
            var vote = await _context.Votes.FindAsync(voteId);
            if (vote != null)
            {
                _context.Votes.Remove(vote);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Vote> GetVoteByIdAsync(int voteId)
        {
            return await _context.Votes.FindAsync(voteId);
        }
    }
}
