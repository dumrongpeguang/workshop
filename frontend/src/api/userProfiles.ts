import type { UpsertUserProfileRequest, UserProfile } from '../types';

// Empty string = relative path, works when the SPA is served by the API on the same origin.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const RESOURCE_URL = `${API_BASE_URL}/api/userprofiles`;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function getUserProfiles(): Promise<UserProfile[]> {
  return fetch(RESOURCE_URL).then((res) => handleResponse<UserProfile[]>(res));
}

export function createUserProfile(request: UpsertUserProfileRequest): Promise<UserProfile> {
  return fetch(RESOURCE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  }).then((res) => handleResponse<UserProfile>(res));
}

export function updateUserProfile(
  id: string,
  request: UpsertUserProfileRequest,
): Promise<UserProfile> {
  return fetch(`${RESOURCE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  }).then((res) => handleResponse<UserProfile>(res));
}

export function deleteUserProfile(id: string): Promise<void> {
  return fetch(`${RESOURCE_URL}/${id}`, { method: 'DELETE' }).then((res) =>
    handleResponse<void>(res),
  );
}
