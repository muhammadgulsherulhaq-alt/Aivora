# AIVORA — Discover AI. Create More.

Starter website files:
- index.html — homepage, category cards, tool directory, signup/login modal
- style.css — responsive dark navy, neon purple, electric blue and cyan design
- script.js — tool search, category filters, signup/login wiring
- config.js — Supabase public configuration

## Important
The signup interface is prepared but is NOT active until Supabase is configured. The site does not yet enforce member-only access or include a members dashboard. Do not claim those features are live.

## Enable real signup
1. Create a free project at https://supabase.com/
2. Open Project Settings → API and copy Project URL and public anon/publishable key.
3. Paste these into config.js as url and anonKey.
4. In Authentication → URL Configuration, add your deployed website URL.
5. Enable Email authentication and test signup/login.
Never expose a service-role key in browser code.

## Publish on GitHub Pages
1. Create a NEW repository named aivora.
2. Upload all files to the repository root.
3. Open Settings → Pages.
4. Choose Deploy from a branch, branch main, folder /(root), then Save.

Before launch, add privacy policy and terms, test signup, create a member-only access gate, and verify current free-plan limits for every listed provider. Free tiers may have limits or credits; they are not necessarily unlimited.