import type { UserProfile } from '../types';

interface UserProfileListProps {
  profiles: UserProfile[];
  onEdit: (profile: UserProfile) => void;
  onDelete: (profile: UserProfile) => void;
}

export function UserProfileList({ profiles, onEdit, onDelete }: UserProfileListProps) {
  if (profiles.length === 0) {
    return <p className="empty-state">No profiles yet. Create the first one!</p>;
  }

  return (
    <ul className="profile-list">
      {profiles.map((profile) => (
        <li key={profile.id} className="profile-card">
          <img
            className="profile-avatar"
            src={profile.avatarUrl || `https://i.pravatar.cc/150?u=${profile.email}`}
            alt={`${profile.firstName} ${profile.lastName}`}
          />
          <div className="profile-details">
            <h3>
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="profile-email">{profile.email}</p>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          </div>
          <div className="profile-actions">
            <button type="button" onClick={() => onEdit(profile)}>
              Edit
            </button>
            <button type="button" className="danger" onClick={() => onDelete(profile)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
