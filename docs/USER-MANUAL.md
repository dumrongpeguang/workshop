# User Manual — User Profile Web Application

This guide explains how to use the User Profiles web app once it is running (see the [README](../README.md) for setup and run instructions).

## Opening the app

- Single-origin mode: open `http://localhost:5052`
- Separate frontend/backend mode: open `http://localhost:5173`

## Viewing profiles

The main page lists all existing user profiles as cards, showing each person's name, email, bio, and avatar (if set). Profiles load automatically when the page opens.

## Creating a profile

1. Fill in the **New profile** form at the top of the page.
2. Required fields: **First name**, **Last name**, **Email**.
3. Optional fields: **Bio**, **Avatar URL**.
4. Click **Save** (submit) to create the profile. It appears in the list below once saved.

## Editing a profile

1. Click **Edit** on a profile card.
2. The form switches to **Edit profile** mode and is pre-filled with that profile's data.
3. Update any fields and submit to save the changes.
4. Click **Cancel** to discard the edit and return to the **New profile** form.

## Deleting a profile

1. Click **Delete** on a profile card.
2. Confirm the deletion in the prompt that appears.
3. The profile is removed from the list. If you were editing that profile, the form resets.

## Notes and limitations

- Data is stored in memory on the backend, so all profiles are lost when the backend restarts.
- Email must be a valid email address; first/last name and email are required to save a profile.

## API reference

For direct API access instead of the UI, see the [API endpoints section in the README](../README.md#api-endpoints).
