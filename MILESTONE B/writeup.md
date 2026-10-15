# Milestone B – Sign in with Google (OAuth 2.0)

LinkLocker uses **Passport.js** (`passport-google-oauth20`) with a Google Cloud OAuth 2.0 client. The Express backend from Milestone A still serves every route; auth is added in `src/auth.js` and wired in from `src/app.js`.

## What is gated

Creating a short link (`POST /api/links`) requires a signed-in user and returns `401` otherwise. The shorten form is hidden in the UI until sign-in. Short-link redirects (`/l/:code`) stay public so shared links keep working. Each new link stores its `owner` (the user's id).

## Google Cloud configuration

- **Project / client type:** OAuth client ID, application type *Web application*, created in Google Auth Platform > Clients.
- **Scopes requested:** `profile` and `email` only (basic sign-in, no access to Google data).
- **Consent screen:** left in **Testing** mode, so only the accounts listed under *Test users* can sign in.
- **Authorized redirect URIs** (must match `GOOGLE_CALLBACK_URL` exactly, including scheme and path):

  | Environment | Redirect URI |
  | --- | --- |
  | Local development | `http://localhost:3000/auth/google/callback` |
  | Azure VM (production) | `https://linklocker.northcentralus.cloudapp.azure.com/auth/google/callback` |

A mismatch produces Google's `redirect_uri_mismatch` error.

## Login flow

1. The user clicks **Sign in with Google**, which goes to `/auth/google`, and the app redirects to Google.
2. Google redirects back to `/auth/google/callback` with a code. Passport exchanges it for the profile.
3. The app upserts a `User` (keyed by Google ID, storing display name and email) and starts a session.
4. Only the user id is stored in the session. The session itself lives in MongoDB (`connect-mongo`), so logins survive restarts.
5. `POST /auth/logout` destroys the session. `GET /api/me` tells the front end who is signed in.

Session cookies are `httpOnly`, `sameSite=lax`, and `secure` when `NODE_ENV=production`. nginx terminates HTTPS and forwards `X-Forwarded-Proto`, and Express has `trust proxy` set, so secure cookies work behind the proxy.

## How secrets are managed

Nothing sensitive is hardcoded or committed. The app reads these from environment variables (loaded from `.env` by `dotenv`):

| Variable | Purpose |
| --- | --- |
| `GOOGLE_CLIENT_ID` | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret |
| `GOOGLE_CALLBACK_URL` | Redirect URI for the current environment |
| `SESSION_SECRET` | Signs session cookies (random 32-byte hex) |
| `NODE_ENV` | `production` on the server |

- `.env` is listed in `.gitignore`. The repo only contains `.env.example` with placeholder values.
- The server refuses to start if the Google variables or `SESSION_SECRET` are missing.
- Local and production each have their own `.env` (different callback URL, `NODE_ENV`, and session secret).
- Google shows the client secret only once at creation. If it is ever exposed, rotate it in the Google Cloud console and update `.env`.
