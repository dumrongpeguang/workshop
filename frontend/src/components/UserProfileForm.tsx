import { useEffect, useState } from 'react';
import type { UpsertUserProfileRequest, UserProfile } from '../types';

interface UserProfileFormProps {
  editingProfile: UserProfile | null;
  onSubmit: (request: UpsertUserProfileRequest) => Promise<void>;
  onCancel: () => void;
}

const emptyForm: UpsertUserProfileRequest = {
  firstName: '',
  lastName: '',
  email: '',
  bio: '',
  avatarUrl: '',
};

export function UserProfileForm({ editingProfile, onSubmit, onCancel }: UserProfileFormProps) {
  const [form, setForm] = useState<UpsertUserProfileRequest>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(
      editingProfile
        ? {
            firstName: editingProfile.firstName,
            lastName: editingProfile.lastName,
            email: editingProfile.email,
            bio: editingProfile.bio ?? '',
            avatarUrl: editingProfile.avatarUrl ?? '',
          }
        : emptyForm,
    );
    setError(null);
  }, [editingProfile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
      if (!editingProfile) {
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  function updateField<K extends keyof UpsertUserProfileRequest>(
    field: K,
    value: UpsertUserProfileRequest[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>{editingProfile ? 'Edit profile' : 'New profile'}</h2>

      <div className="form-row">
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          value={form.firstName}
          required
          maxLength={100}
          onChange={(e) => updateField('firstName', e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          value={form.lastName}
          required
          maxLength={100}
          onChange={(e) => updateField('lastName', e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={form.email}
          required
          maxLength={200}
          onChange={(e) => updateField('email', e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="avatarUrl">Avatar URL</label>
        <input
          id="avatarUrl"
          value={form.avatarUrl}
          maxLength={500}
          onChange={(e) => updateField('avatarUrl', e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          value={form.bio}
          maxLength={500}
          rows={3}
          onChange={(e) => updateField('bio', e.target.value)}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : editingProfile ? 'Save changes' : 'Create profile'}
        </button>
        {editingProfile && (
          <button type="button" className="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
