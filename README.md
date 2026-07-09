
  # Dakar Transit & Auto

  Site vitrine (transit & dédouanement) + catalogue et vente de véhicules, avec un espace admin pour gérer le catalogue.

  ## Running the code

  Run `pnpm i` to install the dependencies.

  Copy `.env.example` to `.env` and fill in your Supabase project's URL and anon key (Project Settings > API on supabase.com).

  Run the SQL in `supabase/migration.sql` once in the Supabase SQL editor to create the `vehicles` table, its policies, and the photo storage bucket.

  Create the admin account in Supabase (Authentication > Users > Add user) — that email/password logs into `/admin`.

  Run `pnpm dev` to start the development server.

  ## Admin

  Go to `/admin` (redirects to `/admin/login` if signed out). From there you can add/edit vehicles, upload a photo, and mark a vehicle as sold without deleting it.

  ## Deploying

  This is a single-page app: any host must rewrite all paths to `/index.html` so `/admin` works after a refresh. `public/_redirects` (Netlify) and `vercel.json` (Vercel) are already set up for that.
  