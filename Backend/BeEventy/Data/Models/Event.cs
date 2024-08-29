using BeEventy.Data.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeEventy.Data.Models
{
    [Table("event")]
    public class Event
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("date_of_start")]
        public DateTime DateOfStart { get; set; }
        [Column("date_of_end")]
        public DateTime DateOfEnd { get; set; }
        [Column("date_of_upload")]
        public DateTime DateOfUpload { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Column("location")]
        public Location Location { get; set; }
        [Column("address")]
        public string Address { get; set; }
        [Column("image")]
        public string Image { get; set; }

        [Column("pluses")]
        public int Pluses { get; set; }
        [Column("minuses")]
        public int Minuses { get; set; }
        [Column("amount_of_all_tickets")]
        public int AmountOfAllTickets { get; set; }
        [Column("amount_of_batches")]
        public int AmmountOfBatches { get; set; }
        [Column("is_confirmed")]
        public bool IsConfirmed { get; set; }
        [Column("number_of_reports")]
        public int NumberOfReports { get; set; }
        [Column("is_sold_out")]
        public bool IsSoldOut { get; set; }
        [Column("is_expired")]
        public bool IsExpired { get; set; }
        [Column("event_type")]
        public EventType EventType { get; set; }
        [Column("author_id")]
        [ForeignKey("AuthorId")]
        public int AuthorId { get; set; }
        [Column("distributor_id")]
        [ForeignKey("DistributorId")]
        public int DistributorId { get; set; }
    }
}
