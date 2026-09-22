using System.ComponentModel.DataAnnotations;

namespace UserProfile.Api.Models;

public class UpsertUserProfileRequest
{
    [Required, MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Bio { get; set; }

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }
}
