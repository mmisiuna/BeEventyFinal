using BeEventy.Data.Models;
using PostgreSQL.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

[Table("vote")]
public class Vote
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }

    [ForeignKey("Event")]
    public int EventId { get; set; }

    public bool IsPlus { get; set; }
}
