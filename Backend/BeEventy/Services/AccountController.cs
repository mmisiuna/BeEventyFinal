using BeEventy.Data.Enums;
using BeEventy.Data.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PostgreSQL.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static BeEventy.Data.Models.Login;

namespace BeEventy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AccountRepository _accountRepository;

        public AccountController(AccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<Account>>> GetAllAccounts()
        {
            var accounts = await _accountRepository.GetAllAccountsAsync();
            return Ok(accounts);
        }

        [HttpGet("id/{id}")]
        public async Task<ActionResult<Account>> GetAccountById(int id)
        {
            var account = await _accountRepository.GetAccountByIdAsync(id);
            if (account == null)
            {
                return NotFound();
            }
            return Ok(account);
        }

        [HttpGet("name/{name}")]
        public async Task<ActionResult<Account>> GetAccountByName(string name)
        {
            var account = await _accountRepository.GetAccountByNameAsync(name);
            if (account == null)
            {
                return NotFound();
            }
            return Ok(account);
        }

        [HttpPut("deactivate/{id}")]
        public async Task<IActionResult> DeactivateAccount(int id)
        {
            var account = await _accountRepository.GetAccountByIdAsync(id);
            if (account == null)
            {
                return NotFound();
            }
            account.ActiveAccount = false;
            await _accountRepository.UpdateAccountAsync(account);
            return Ok(new { message = "Account deactivated" });
        }

        [HttpPut("activate/{id}")]
        public async Task<IActionResult> ActivateAccount(int id)
        {
            var account = await _accountRepository.GetAccountByIdAsync(id);
            if (account == null)
            {
                return NotFound();
            }
            account.ActiveAccount = true;
            await _accountRepository.UpdateAccountAsync(account);
            return Ok("Account activated");
        }

        [HttpPut("grantPermission/{id}/{accountType}")]
        public async Task<IActionResult> GrantPermission(int id, int accountType)
        {
            var account = await _accountRepository.GetAccountByIdAsync(id);
            if (account == null)
            {
                return NotFound();
            }
            account.AccountType = (AccountType)accountType;
            await _accountRepository.UpdateAccountAsync(account);
            return Ok("Account grants permission");
        }

        [HttpGet("email/{email}")]
        public async Task<ActionResult<Account>> GetAccountByEmail(string email)
        {
            var account = await _accountRepository.GetAccountByEmailAsync(email);
            if (account == null)
            {
                return NotFound();
            }
            return Ok(account);
        }

        [HttpPost]
        public async Task<ActionResult<Account>> AddAccount(Account account)
        {
            account.ProfileImage = "default.png";
            account.ActiveAccount = true;
            account.AccountType = AccountType.User; // Assuming 0 represents 'Regular'

            await _accountRepository.AddAccountAsync(account);
            return CreatedAtAction(nameof(GetAllAccounts), new { id = account.Id }, account);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccountById(int id)
        {
            await _accountRepository.DeleteAccountAsync(id);
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var account = await _accountRepository.GetAccountByEmailAsync(request.Email);
            if (account != null && account.Password == request.Password)
            {
                if (!account.ActiveAccount) // Sprawdzenie, czy konto jest aktywne
                {
                    return Unauthorized("This account has been deactivated. Please contact support.");
                }

                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superTajneHasłoooooooooooooooooooooooooooooooo"));
                var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokenOptions = new JwtSecurityToken(
                    issuer: "http://localhost:5260",
                    audience: "http://localhost:4200",
                    claims: new List<Claim>(),
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: credentials
                );
                var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

                return Ok(new LoginResponse(token, account.Id));
            }

            return Unauthorized();
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] Account updatedAccount)
        {
            if (id != updatedAccount.Id)
            {
                return BadRequest("ID in the path and the account data do not match.");
            }

            var existingAccount = await _accountRepository.GetAccountByIdAsync(id);
            if (existingAccount == null)
            {
                return NotFound();
            }

            existingAccount.Name = updatedAccount.Name;
            existingAccount.Password = updatedAccount.Password;
            existingAccount.Email = updatedAccount.Email;
            existingAccount.PhoneNumber = updatedAccount.PhoneNumber;
            existingAccount.ProfileImage = updatedAccount.ProfileImage;
            existingAccount.ActiveAccount = updatedAccount.ActiveAccount;
            existingAccount.AccountType = updatedAccount.AccountType;
            existingAccount.ForgottenPassword = updatedAccount.ForgottenPassword;
            await _accountRepository.UpdateAccountAsync(existingAccount);

            return NoContent(); // Można zwrócić Ok(existingAccount), jeśli chcemy potwierdzenie
        }

        [HttpGet("emailbyid/{id}")]
        public async Task<ActionResult<string>> GetEmailById(int id)
        {
            var account = await _accountRepository.GetAccountByIdAsync(id);
            if (account == null)
            {
                return NotFound();
            }
            return Ok(account.Email);
        }

        [HttpGet("profileimage/{id}")]
        public async Task<ActionResult<string>> GetProfileImage(int id)
        {
            var account = await _accountRepository.GetAccountByIdAsync(id);
            if (account == null)
            {
                return NotFound();
            }
            return Ok(account.ProfileImage);
        }

        [HttpGet("exists/email/{email}")]
        public async Task<ActionResult<bool>> EmailExists(string email)
        {
            var exists = await _accountRepository.EmailExistsAsync(email);
            return Ok(exists);
        }

        [HttpGet("exists/phone/{phoneNumber}")]
        public async Task<ActionResult<bool>> PhoneNumberExists(string phoneNumber)
        {
            var exists = await _accountRepository.PhoneNumberExistsAsync(phoneNumber);
            return Ok(exists);
        }

        [HttpPut("resetPassword/{email}")]
        public async Task<ActionResult> ResetPassword(string email)
        {
            var account = await _accountRepository.GetAccountByEmailAsync(email);
            if (account == null)
            {
                return NotFound();
            }
            account.ActiveAccount = true;
            account.ForgottenPassword = false;
            string newPassword = GenerateRandomPassword();
            account.Password = newPassword;
            await _accountRepository.UpdateAccountAsync(account);
            return Ok(new { message = "Reset request was sent", newPassword = newPassword });
        }

        private string GenerateRandomPassword(int length = 16)
        {
            const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?_-";
            char[] password = new char[length];
            byte[] randomBytes = new byte[length];

            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }

            for (int i = 0; i < password.Length; i++)
            {
                password[i] = validChars[randomBytes[i] % validChars.Length];
            }

            return new string(password);
        }

        [HttpPut("requestForResetPassword/{email}")]
        public async Task<ActionResult<bool>> RequestForResetPassword(string email)
        {
            var account = await _accountRepository.GetAccountByEmailAsync(email);
            if (account == null)
            {
                return NotFound();
            }
            account.ActiveAccount = false;
            account.ForgottenPassword = true;
            await _accountRepository.UpdateAccountAsync(account);
            return Ok(new { message = "Reset request was send" });
        }
    }
}
