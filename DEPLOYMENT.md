# Deployment Guide

This guide covers deploying the Student System application to production. The application has two parts:
- **Frontend (Angular)**: Deployed to GitHub Pages
- **Backend (Express API)**: Deployed to Render.com

## Prerequisites

- GitHub account
- Render.com account (free tier available)
- Git installed locally

## Part 1: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to [Render.com](https://render.com) and sign up
2. Connect your GitHub account to Render

### Step 2: Deploy the Backend

1. Log in to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository: `https://github.com/moatazhamdy/student-system`
4. Configure the service:
   - **Name**: `student-system-api` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `master`
   - **Root Directory**: Leave empty (uses repository root)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`

5. Click "Advanced" and add environment variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = (generate a random secret key, e.g., use a password generator)
   - `PORT` = `10000` (automatically set by Render)

6. Click "Create Web Service"

### Step 3: Wait for Deployment

Render will automatically build and deploy your backend. This may take 5-10 minutes.

Once deployed, you'll get a URL like: `https://student-system-api.onrender.com`

### Step 4: Test Backend

Visit `https://your-backend-url.onrender.com/health` to verify the API is running. You should see:
```json
{
  "status": "ok",
  "message": "Database API is running"
}
```

**Important Notes:**
- Free tier services may spin down after inactivity
- First request after inactivity may take 30-60 seconds to wake up
- Consider upgrading to a paid plan for production use

## Part 2: Deploy Frontend to GitHub Pages

### Step 1: Update Backend URL

1. Open `src/environments/environment.production.ts`
2. Update the `apiUrl` with your Render backend URL:
   ```typescript
   apiUrl: 'https://your-backend-url.onrender.com/api',
   ```

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository settings
2. Navigate to **Settings** > **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
4. Save the settings

### Step 3: Commit and Push Changes

```bash
# Add all deployment files
git add .

# Commit changes
git commit -m "Configure deployment for GitHub Pages and Render"

# Push to GitHub
git push origin master
```

### Step 4: Monitor Deployment

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. You should see a workflow running called "Deploy to GitHub Pages"
4. Wait for the workflow to complete (usually 2-5 minutes)

### Step 5: Access Your Application

Once deployed, your application will be available at:
```
https://moatazhamdy.github.io/student-system/
```

## Testing the Deployment

### Default Login Credentials

The application comes with default users in `database/users.json`. Use these to log in:

- **Admin User**:
  - Username: `admin`
  - Password: `admin123`

- **Regular User**:
  - Username: `user`
  - Password: `user123`

**Security Warning**: Change these credentials in production!

### Test Checklist

- [ ] Navigate to the deployed URL
- [ ] Log in with default credentials
- [ ] Create a new student
- [ ] Edit a student
- [ ] Delete a student
- [ ] Verify data persists after page reload
- [ ] Test logout functionality

## Troubleshooting

### GitHub Pages Issues

**404 Error on page refresh:**
- This is expected for Single Page Applications
- The workflow includes a 404.html redirect fix
- If still occurring, check that the workflow ran successfully

**CSS/Assets not loading:**
- Verify `baseHref` is set to `/student-system/` in `angular.json`
- Clear browser cache and hard refresh (Ctrl+F5)

**Routing issues:**
- Check that Angular's `PathLocationStrategy` is being used
- Verify all routes use relative paths

### Backend Issues

**Backend not responding:**
- Check Render dashboard for service status
- View logs in Render dashboard
- Verify environment variables are set correctly
- Free tier services sleep after inactivity - first request may be slow

**CORS errors:**
- The backend includes CORS middleware
- If issues persist, check browser console for exact error
- Verify the frontend is using the correct backend URL

**Authentication failing:**
- Verify `JWT_SECRET` is set in Render environment variables
- Check that the secret is the same across deployments
- Clear browser localStorage and try again

**Data not persisting:**
- Render's free tier uses ephemeral storage
- Data resets when service restarts
- For persistent storage, consider:
  - Upgrading to Render's persistent disk plan
  - Using a database service (MongoDB Atlas, PostgreSQL)
  - Implementing cloud storage for JSON files

## Updating the Application

### Frontend Updates

1. Make changes to your code
2. Commit and push to the `master` branch
3. GitHub Actions will automatically rebuild and deploy

### Backend Updates

1. Make changes to `server.js` or related files
2. Commit and push to the `master` branch
3. Render will automatically rebuild and deploy

## Custom Domain (Optional)

### For GitHub Pages:
1. Go to repository **Settings** > **Pages**
2. Add your custom domain
3. Configure DNS with your domain provider

### For Render:
1. Go to your service in Render dashboard
2. Navigate to **Settings** > **Custom Domains**
3. Add your domain and follow DNS configuration instructions

## Monitoring and Analytics

### Backend Monitoring:
- Use Render's built-in logs and metrics
- Consider adding monitoring services like:
  - New Relic (free tier available)
  - Datadog (free tier available)

### Frontend Monitoring:
- Enable analytics in `environment.production.ts`
- Consider adding:
  - Google Analytics
  - Sentry for error tracking

## Security Recommendations

1. **Change Default Passwords**: Update all passwords in `database/users.json`
2. **Secure JWT Secret**: Use a strong, random secret for JWT_SECRET
3. **HTTPS Only**: Both GitHub Pages and Render provide HTTPS by default
4. **Rate Limiting**: Consider adding rate limiting to prevent abuse
5. **Input Validation**: Ensure all user inputs are validated
6. **Regular Updates**: Keep dependencies updated

## Cost Considerations

### Free Tier Limits:

**GitHub Pages:**
- 100GB bandwidth per month
- 1GB repository size
- Usually sufficient for most projects

**Render (Free Tier):**
- 750 hours per month (enough for one service)
- Services sleep after 15 minutes of inactivity
- 512MB RAM
- Ephemeral storage (data resets on restart)

### When to Upgrade:

- Traffic exceeds free tier limits
- Need persistent storage
- Require faster response times
- Need multiple services running 24/7

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/moatazhamdy/student-system/issues)
- Review Render documentation: https://render.com/docs
- Review GitHub Pages documentation: https://docs.github.com/pages

## Architecture Diagram

```
┌─────────────────┐
│   GitHub Pages  │
│   (Frontend)    │
│  Angular App    │
└────────┬────────┘
         │
         │ HTTPS
         │
         ▼
┌─────────────────┐
│   Render.com    │
│   (Backend)     │
│  Express API    │
│  + JSON DB      │
└─────────────────┘
```

## Next Steps

After successful deployment:
1. Share the URL with users
2. Monitor application performance
3. Set up error tracking
4. Plan for data backup strategy
5. Consider implementing a real database for production use
