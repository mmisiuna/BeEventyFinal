using BeEventy.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PostgreSQL.Data;

namespace BeEventy.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Distributor> Distributors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Account>().ToTable("account");
            modelBuilder.Entity<Event>().ToTable("event");
            modelBuilder.Entity<Vote>().ToTable("vote");
            modelBuilder.Entity<Ticket>().ToTable("ticket");
            modelBuilder.Entity<Report>().ToTable("report");
            modelBuilder.Entity<Distributor>().ToTable("distributor");
            base.OnModelCreating(modelBuilder);
            //modelBuilder.Entity<Account>().HasData(
            //    new Account { Id = 1, Name = "John Doe", Password = "password123", Email = "john@example.com", PhoneNumber = "123-456-789", ProfileImage = "john_profile.jpg", ActiveAccount = true, AccountType = 0 },
            //    new Account { Id = 2, Name = "Alice Smith", Password = "password456", Email = "alice@example.com", PhoneNumber = "987-654-321", ProfileImage = "alice_profile.jpg", ActiveAccount = true, AccountType = 0 },
            //    new Account { Id = 3, Name = "Bob Johnson", Password = "password789", Email = "bob@example.com", PhoneNumber = "555-555-555", ProfileImage = "bob_profile.jpg", ActiveAccount = true, AccountType = 0 },
            //    new Account { Id = 4, Name = "Event Moderator", Password = "password111", Email = "moderator@example.com", PhoneNumber = "111-222-333", ProfileImage = "moderator_profile.jpg", ActiveAccount = true, AccountType = 1 },
            //    new Account { Id = 5, Name = "Admin", Password = "admin123", Email = "admin@example.com", PhoneNumber = "456-123-333", ProfileImage = "admin_profile.jpg", ActiveAccount = true, AccountType = 1 }
            //);

            //modelBuilder.Entity<Event>().HasData(
            //    new Event { Id = 1, Name = "Gwarki", DateOfStart = new DateTime(2024, 9, 6, 10, 0, 0), DateOfEnd = new DateTime(2024, 9, 8, 23, 59, 59), DateOfUpload = new DateTime(2024, 6, 1, 12, 0, 0), Description = "Annual celebration with music, performances, and various attractions in Tarnowskie Góry.", Address = "Tarnowskie Góry, Poland", Image = "gwarki.jpg", AuthorId = 4, Pluses = 0, Minuses = 0, AmountOfAllTickets = 1000, AmountOfBatches = 10, IsReported = false, IsSoldOut = false, IsExpired = false, EventStatus = 0, EventType = 1 },
            //    new Event { Id = 2, Name = "Czerwone Gitary – Diamentowa Trasa 60-lecia", DateOfStart = new DateTime(2024, 10, 1, 19, 0, 0), DateOfEnd = new DateTime(2024, 10, 1, 21, 0, 0), DateOfUpload = new DateTime(2024, 8, 1, 9, 0, 0), Description = "Celebration of 60 years of the legendary Polish band Czerwone Gitary.", Address = "Września, Poland", Image = "czerwone_gitary.jpg", AuthorId = 4, Pluses = 0, Minuses = 0, AmountOfAllTickets = 800, AmountOfBatches = 8, IsReported = false, IsSoldOut = false, IsExpired = false, EventStatus = 0, EventType = 2 },
            //    new Event { Id = 3, Name = "Kortez – Naucz Mnie Tańczyć Wiosna Tour", DateOfStart = new DateTime(2024, 5, 20, 18, 0, 0), DateOfEnd = new DateTime(2024, 5, 20, 20, 0, 0), DateOfUpload = new DateTime(2024, 3, 20, 10, 0, 0), Description = "Spring tour of the renowned Polish artist Kortez.", Address = "Poznań, Poland", Image = "kortez.jpg", AuthorId = 5, Pluses = 0, Minuses = 0, AmountOfAllTickets = 600, AmountOfBatches = 6, IsReported = false, IsSoldOut = false, IsExpired = false, EventStatus = 0, EventType = 2 },
            //    new Event { Id = 4, Name = "Myslovitz – 25 lat miłości w czasach popkultury część druga", DateOfStart = new DateTime(2024, 6, 15, 19, 0, 0), DateOfEnd = new DateTime(2024, 6, 15, 21, 0, 0), DateOfUpload = new DateTime(2024, 4, 15, 9, 0, 0), Description = "Celebration of 25 years of the iconic Polish band Myslovitz.", Address = "Katowice, Poland", Image = "myslovitz.jpg", AuthorId = 5, Pluses = 0, Minuses = 0, AmountOfAllTickets = 700, AmountOfBatches = 7, IsReported = false, IsSoldOut = false, IsExpired = false, EventStatus = 0, EventType = 2 },
            //    new Event { Id = 5, Name = "The Legend of Rock Symphonic", DateOfStart = new DateTime(2024, 11, 5, 20, 0, 0), DateOfEnd = new DateTime(2024, 11, 5, 22, 0, 0), DateOfUpload = new DateTime(2024, 9, 5, 10, 0, 0), Description = "Symphonic interpretations of classic rock hits.", Address = "Warsaw, Poland", Image = "rock_symphonic.jpg", AuthorId = 6, Pluses = 0, Minuses = 0, AmountOfAllTickets = 900, AmountOfBatches = 9, IsReported = false, IsSoldOut = false, IsExpired = false, EventStatus = 0, EventType = 3 }
            //);

        }
    }
}
