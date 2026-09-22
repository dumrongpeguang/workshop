using UserProfile.Api.Models;

namespace UserProfile.Api.Services;

public interface IUserProfileService
{
    Task<IReadOnlyList<UserProfileModel>> GetAllAsync();
    Task<UserProfileModel?> GetByIdAsync(Guid id);
    Task<UserProfileModel> CreateAsync(UpsertUserProfileRequest request);
    Task<UserProfileModel?> UpdateAsync(Guid id, UpsertUserProfileRequest request);
    Task<bool> DeleteAsync(Guid id);
}
