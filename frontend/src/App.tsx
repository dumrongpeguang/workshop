import { useCallback, useEffect, useState } from 'react';
import './App.css';
import {
  createUserProfile,
  deleteUserProfile,
  getUserProfiles,
  updateUserProfile,
} from './api/userProfiles';
import { UserProfileForm } from './components/UserProfileForm';
import { UserProfileList } from './components/UserProfileList';
import type { UpsertUserProfileRequest, UserProfile } from './types';

function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProfiles(await getUserProfiles());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profiles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  async function handleSubmit(request: UpsertUserProfileRequest) {
    if (editingProfile) {
      await updateUserProfile(editingProfile.id, request);
    } else {
      await createUserProfile(request);
    }
    setEditingProfile(null);
    await loadProfiles();
  }

  async function handleDelete(profile: UserProfile) {
    const confirmed = window.confirm(
      `Delete ${profile.firstName} ${profile.lastName}'s profile?`,
    );
    if (!confirmed) {
      return;
    }
    await deleteUserProfile(profile.id);
    if (editingProfile?.id === profile.id) {
      setEditingProfile(null);
    }
    await loadProfiles();
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>User Profiles</h1>
        <p>Manage user profiles backed by the .NET 10 API.</p>
      </header>

      <main className="app-main">
        <UserProfileForm
          editingProfile={editingProfile}
          onSubmit={handleSubmit}
          onCancel={() => setEditingProfile(null)}
        />

        <section className="profile-section">
          {loading && <p>Loading profiles...</p>}
          {error && <p className="form-error">{error}</p>}
          {!loading && !error && (
            <UserProfileList
              profiles={profiles}
              onEdit={setEditingProfile}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

