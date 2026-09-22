using Microsoft.AspNetCore.Mvc;
using UserProfile.Api.Models;
using UserProfile.Api.Services;

namespace UserProfile.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserProfilesController : ControllerBase
{
    private readonly IUserProfileService _service;

    public UserProfilesController(IUserProfileService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserProfileModel>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserProfileModel>> GetById(Guid id)
    {
        var profile = await _service.GetByIdAsync(id);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpPost]
    public async Task<ActionResult<UserProfileModel>> Create(UpsertUserProfileRequest request)
    {
        var profile = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = profile.Id }, profile);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UserProfileModel>> Update(Guid id, UpsertUserProfileRequest request)
    {
        var profile = await _service.UpdateAsync(id, request);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
