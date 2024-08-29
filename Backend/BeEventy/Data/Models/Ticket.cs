using PostgreSQL.Data;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeEventy.Data.Models
{
    [Table("ticket")]
    public class Ticket
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("price")]
        public decimal Price { get; set; }

        [Column("event_id")]
        [ForeignKey("EventId")]
        public int EventId { get; set; }

    }
}
