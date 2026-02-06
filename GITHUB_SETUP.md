# GitHub Repository Setup Instructions

## Step 1: Create Repository on GitHub

**IMPORTANT**: You must create the repository on GitHub first before pushing!

1. Go to https://github.com/thisaitech (or your organization)
2. Click "New repository" or go to: https://github.com/organizations/thisaitech/repositories/new
3. Repository name: `eventic-premium-event-booking`
4. Description: "Premium Event Booking Platform - React + TypeScript + Node.js"
5. Choose visibility (Private/Public based on your office policy)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

**After creating the repository, come back and continue with Step 2**

## Step 2: Push to GitHub (SSH - Already Configured)

The remote is already configured to use SSH. After creating the repository on GitHub, run:

```bash
# The remote is already set to: git@github.com:thisaitech/eventic-premium-event-booking.git
git push -u origin main
```

**If you get "Host key verification failed":**
- First time connecting to GitHub? Run: `ssh -T git@github.com` and accept the host key
- Or add GitHub to known_hosts: `ssh-keyscan github.com >> ~/.ssh/known_hosts` (PowerShell: different syntax)

**If SSH keys aren't set up:**
- Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
- Add to GitHub: Settings > SSH and GPG keys > New SSH key
- Copy public key: `cat ~/.ssh/id_ed25519.pub` (PowerShell: `Get-Content ~/.ssh/id_ed25519.pub`)

## Step 3: Authentication

If you're using HTTPS, you'll be prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your GitHub password)
  - Go to: GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
  - Generate new token with `repo` scope
  - Use this token as your password

## Alternative: Using SSH (Recommended)

If you have SSH keys set up:

```bash
# Use SSH URL instead
git remote set-url origin git@github.com:YOUR-ORG/eventic-premium-event-booking.git

# Push
git push -u origin main
```

## Repository Structure

The repository includes:
- `frontend/` - React + TypeScript + Vite frontend
- `backend/` - Node.js/Express backend (optional)
- Configuration files
- Documentation

## Next Steps After Push

1. Set up branch protection rules (if required by your organization)
2. Add collaborators
3. Set up GitHub Actions/CI if needed
4. Update README.md with setup instructions

## Commands Summary

```bash
# Current status
git status

# View commits
git log --oneline

# Push updates (after initial push)
git add .
git commit -m "Your commit message"
git push origin main
```

