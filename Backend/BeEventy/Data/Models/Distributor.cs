using System.ComponentModel.DataAnnotations.Schema;

namespace BeEventy.Data.Models
{
    [Table("distributor")]
    public class Distributor
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }
        [Column("search_adress")]
        public string searchAdress { get; set; }
    }
}
