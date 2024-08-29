using BeEventy.Data.Enums;
using BeEventy.Data.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace PostgreSQL.Data
{
    [Table("account")]
    public class Account
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("password")]
        public string Password { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("phone_number")]
        public string PhoneNumber { get; set; }

        [Column("profile_image")]
        public string ProfileImage { get; set; } = "default.png";

        [Column("active_account")]
        public bool ActiveAccount { get; set; } = true;

        [Column("account_type")]
        public AccountType AccountType { get; set; } = AccountType.User;

        [Column("forgotten_password")]
        public bool ForgottenPassword { get; set; } = false;
    }
}
