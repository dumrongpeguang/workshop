export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertUserProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
}
