namespace BeEventy.Data.Models
{
    public class Login
    {
            public record LoginRequest(string Email, string Password);
            public record LoginResponse(string Token, int UserId);
    }
}
