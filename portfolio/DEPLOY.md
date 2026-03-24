# Free Deployment

This app is best deployed on:

- `Vercel` free plan for the Next.js app
- `MongoDB Atlas` free plan for the database
- `Cloudinary` free plan for uploads

## Why this stack

- The app is a single Next.js application with API routes, which Vercel supports directly.
- It uses MongoDB via Mongoose, so Atlas is the simplest free managed database.
- Production file uploads should not use local disk, so Cloudinary handles that cleanly.

## 1. Prepare environment variables

Create production values based on [.env.example](/C:/Users/chris/OneDrive/Documents/PROJECTS/PORTFOLIO/portfolio/.env.example).

Required values:

- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional but recommended:

- `GMAIL_EMAIL`
- `GMAIL_APP_PASSWORD`

## 2. Create free external services

### MongoDB Atlas

1. Create a free cluster.
2. Create a database user.
3. Allow Vercel access with `0.0.0.0/0` for now, or tighten it later.
4. Copy the connection string into `MONGODB_URI`.

### Cloudinary

1. Create a free Cloudinary account.
2. Copy `cloud name`, `api key`, and `api secret`.
3. Add them to Vercel environment variables.

### Gmail SMTP

1. Enable 2-factor authentication on the Gmail account.
2. Generate an app password.
3. Set `GMAIL_EMAIL` and `GMAIL_APP_PASSWORD`.

## 3. Generate admin password hash

Run this locally from the app folder:

```powershell
node -e "console.log(require('bcryptjs').hashSync('your-admin-password', 10))"
```

Put the output into `ADMIN_PASSWORD_HASH`.

## 4. Deploy to Vercel

1. Push the `portfolio` app to GitHub.
2. Import the repo into Vercel.
3. Set the project root directory to `portfolio`.
4. Add all environment variables in Vercel Project Settings.
5. Deploy.

## 5. Set the final site URL

After the first deploy, update:

- `NEXTAUTH_URL=https://your-live-domain`

Then redeploy.

## Notes

- In production, uploads now require Cloudinary. Local disk uploads are only for development.
- If you committed real secrets in `.env.local`, rotate them before going live.
