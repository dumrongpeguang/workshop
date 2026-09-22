using System.Collections.Concurrent;
using UserProfile.Api.Models;

namespace UserProfile.Api.Services;

// Thread-safe in-memory store; swap with a real database-backed implementation later.
public class InMemoryUserProfileService : IUserProfileService
{
    private readonly ConcurrentDictionary<Guid, UserProfileModel> _profiles = new();

    public InMemoryUserProfileService()
    {
        var seed = new UserProfileModel
        {
            Id = Guid.NewGuid(),
            FirstName = "Ada",
            LastName = "Lovelace",
            Email = "ada.lovelace@example.com",
            Bio = "Mathematician and writer, known for work on Charles Babbage's Analytical Engine.",
            AvatarUrl = "https://i.pravatar.cc/150?u=ada.lovelace@example.com",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _profiles[seed.Id] = seed;
    }

    public Task<IReadOnlyList<UserProfileModel>> GetAllAsync()
    {
        IReadOnlyList<UserProfileModel> result = _profiles.Values
            .OrderBy(p => p.CreatedAt)
            .ToList();
        return Task.FromResult(result);
    }

    public Task<UserProfileModel?> GetByIdAsync(Guid id)
    {
        _profiles.TryGetValue(id, out var profile);
        return Task.FromResult(profile);
    }

    public Task<UserProfileModel> CreateAsync(UpsertUserProfileRequest request)
    {
        var now = DateTime.UtcNow;
        var profile = new UserProfileModel
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Bio = request.Bio,
            AvatarUrl = request.AvatarUrl,
            CreatedAt = now,
            UpdatedAt = now
        };
        _profiles[profile.Id] = profile;
        return Task.FromResult(profile);
    }

    public Task<UserProfileModel?> UpdateAsync(Guid id, UpsertUserProfileRequest request)
    {
        if (!_profiles.TryGetValue(id, out var existing))
        {
            return Task.FromResult<UserProfileModel?>(null);
        }

        existing.FirstName = request.FirstName;
        existing.LastName = request.LastName;
        existing.Email = request.Email;
        existing.Bio = request.Bio;
        existing.AvatarUrl = request.AvatarUrl;
        existing.UpdatedAt = DateTime.UtcNow;

        return Task.FromResult<UserProfileModel?>(existing);
    }

    public Task<bool> DeleteAsync(Guid id)
    {
        return Task.FromResult(_profiles.TryRemove(id, out _));
    }
}
