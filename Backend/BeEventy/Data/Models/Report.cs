using PostgreSQL.Data;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeEventy.Data.Models
{
    [Table("report")]
    public class Report
    {

        [Column("id")]
        public int Id { get; set; }
        [Column("description")]
        public string? Description { get; set; }

        [ForeignKey("EventId")]
        public int EventId { get; set; }
        [ForeignKey("AccountId")]
        public int AccountId { get; set; }

    }
}
