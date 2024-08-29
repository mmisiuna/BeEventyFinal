using BeEventy.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BeEventy.Data.Repositories
{
    public class DistributorRepository
    {
        private readonly AppDbContext _context;

        public DistributorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Distributor>> GetAllDistributorsAsync()
        {
            return await _context.Distributors.ToListAsync();
        }

        public async Task<Distributor> GetDistributorByIdAsync(int id)
        {
            return await _context.Distributors.FindAsync(id);
        }

        public async Task AddDistributorAsync(Distributor distributor)
        {
            _context.Distributors.Add(distributor);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateDistributorAsync(Distributor distributor)
        {
            _context.Entry(distributor).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDistributorAsync(int id)
        {
            var distributor = await _context.Distributors.FindAsync(id);
            if (distributor != null)
            {
                _context.Distributors.Remove(distributor);
                await _context.SaveChangesAsync();
            }
        }
    }
}
