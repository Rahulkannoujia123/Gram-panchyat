# Deployment Guide - Rahul Dry Cleaners

## Pre-Deployment Checklist

- [ ] All features tested in preview
- [ ] Voice recognition working in all browsers
- [ ] Orders auto-saving with ₹8/item calculation
- [ ] Customer analytics displaying correctly
- [ ] WhatsApp integration tested
- [ ] PDF export working

## Step 1: Push to GitHub

### Option A: Using v0 Settings (Recommended)

1. In v0 sidebar, click **Settings**
2. Under "Repository", click **Connect to GitHub**
3. Sign in with your GitHub account
4. Select "Create new repository"
5. Name it: `rahul-dry-cleaners`
6. Click **Create and push**
7. v0 will automatically push all code to GitHub

### Option B: Manual GitHub Setup

```bash
# Initialize git locally (if not already done)
git init
git add .
git commit -m "Initial commit: Rahul Dry Cleaners app"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/rahul-dry-cleaners.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### From v0 Interface

1. In v0 top-right, click **Publish**
2. Select the GitHub repository
3. Click **Deploy**
4. Wait for deployment to complete
5. Your app will be live at: `https://rahul-dry-cleaners.vercel.app`

### From Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **New Project**
3. Import the GitHub repository
4. Framework: **Next.js** (auto-detected)
5. Root Directory: `.` (default)
6. Click **Deploy**

## Step 3: Verify Deployment

After deployment completes:

- [ ] Visit your live URL in browser
- [ ] Test voice recognition (must use HTTPS)
- [ ] Create a test order via voice
- [ ] Verify order appears in list
- [ ] Check analytics tab loads
- [ ] Test customer balance tracking

## Environment Variables (Optional)

Currently, the app requires **no environment variables** as all data is stored locally in the browser.

If you want to add backend features later:
- Add environment variables in **Vercel Dashboard** → **Settings** → **Environment Variables**
- Update code to use them

## Custom Domain

To use a custom domain like `drycleaner.com`:

1. In Vercel Dashboard → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain name
4. Follow DNS configuration instructions provided

## Troubleshooting Deployment

### Voice Not Working After Deploy
- **Cause**: Voice API requires HTTPS
- **Solution**: Vercel always provides HTTPS - should work automatically
- Check browser console for errors

### Orders Not Persisting
- **Cause**: Browser is in private/incognito mode
- **Solution**: Use normal browsing mode, or clear site data
- **Alternative**: Implement cloud database (Supabase/Firebase)

### Blank Page After Deploy
- **Cause**: Build error or missing dependencies
- **Solution**: Check Vercel deployment logs
  1. Go to Vercel Dashboard
  2. Select your project
  3. View "Deployments" tab
  4. Click failed deployment for error logs

## Performance Optimization (Optional)

Vercel automatically optimizes:
- Image compression
- Code splitting
- CDN caching
- Edge caching

No additional configuration needed!

## Analytics Setup (Optional)

Vercel provides built-in Web Analytics:

1. Vercel Dashboard → **Analytics**
2. Enable **Web Analytics**
3. View real-time traffic and performance metrics

## Backup Before Major Changes

Before making significant changes:

```bash
# Create a backup branch
git checkout -b backup-$(date +%Y%m%d)
git push origin backup-$(date +%Y%m%d)
```

## Rollback if Needed

If something goes wrong:

```bash
# View deployment history
git log --oneline

# Revert to previous deployment
git revert <commit-hash>
git push
```

Vercel will automatically redeploy from the new commit.

## Support & Help

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Create issue in your repository

---

**Note**: Once deployed, the app works completely offline after initial load since all data is stored locally in the browser.
