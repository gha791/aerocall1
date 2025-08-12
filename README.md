# AEROCALL - Next.js Starter

This is a NextJS starter app for AEROCALL, an all-in-one cloud phone system for all businesses.

## How to Deploy to Vercel

The best way to deploy this Next.js application is to use [Vercel](https://vercel.com), from the creators of Next.js.

### Step 1: Push Your Code to a Git Repository

Vercel deploys directly from a Git repository (like GitHub, GitLab, or Bitbucket).

1.  If you haven't already, create a new repository on [GitHub](https://github.com/new).
2.  Follow the instructions on GitHub to "push an existing repository from the command line" to upload your local project code.

### Step 2: Import Your Project into Vercel

1.  Go to [vercel.com](https://vercel.com) and sign up for a new account (the "Hobby" plan is free).
2.  Once you are on your Vercel dashboard, click "**Add New...**" -> "**Project**".
3.  Connect Vercel to your GitHub account and select the repository you just created. Vercel will automatically detect that it's a Next.js project.

### Step 3: Configure Environment Variables

This is the most important step. Vercel needs access to the secrets you stored in your `.env.local` file.

1.  In the "Import Project" screen, expand the "**Environment Variables**" section.
2.  You will need to add each variable from your `.env.local` file one by one.
    *   **Copy** the variable name (e.g., `RC_CLIENT_ID`).
    *   **Paste** it into the "Name" field in Vercel.
    *   **Copy** the corresponding value (the part after the equals sign).
    *   **Paste** it into the "Value" field in Vercel.
3.  Repeat this for all the variables in your `.env.local` file:
    *   `RC_CLIENT_ID`
    *   `RC_CLIENT_SECRET`
    *   `RC_ADMIN_SUB`
    *   `RC_PRIVATE_KEY` (Make sure to paste the entire single-line key, including the quotes)
    *   `RC_FROM_NUMBER`

### Step 4: Deploy

1.  After adding all the environment variables, click the "**Deploy**" button.
2.  Vercel will build and deploy your application. When it's finished, you'll be given a public URL where you can see your live app.

Your application is now deployed and ready to use!
