# Backend Deployment Guide

## Quick Deploy to Railway

Railway is the easiest way to deploy this backend.

### Steps:

1. **Sign up at Railway**: https://railway.app
   - Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `kissanmandi` repository
   - Set Root Directory to: `backend`

3. **Configure Environment Variables**:
   - Go to Variables tab
   - Add these variables:
     ```
     PORT=5000
     NODE_ENV=production
     MONGODB_URI=your_mongodb_atlas_connection_string
     GEMINI_API_KEY=your_gemini_api_key
     FRONTEND_URL=https://your-frontend.vercel.app
     ```

4. **Deploy**:
   - Railway will automatically detect Node.js and deploy
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

5. **Update Frontend**:
   - Go to Vercel project settings
   - Add environment variable: `VITE_API_URL=https://your-app.railway.app/api`
   - Redeploy frontend

---

## Alternative: Deploy to Render

1. **Sign up at Render**: https://render.com
   - Sign in with GitHub

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set:
     - Name: `kisaan-mandi-backend`
     - Root Directory: `backend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`

3. **Add Environment Variables**:
   - Add the same variables as Railway above

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment
   - Copy the URL

---

## MongoDB Atlas Setup (Required)

1. **Create MongoDB Atlas Account**: https://www.mongodb.com/cloud/atlas

2. **Create Cluster**:
   - Choose free tier (M0)
   - Select a region close to you

3. **Create Database User**:
   - Go to Database Access
   - Add new user with username/password
   - Save credentials

4. **Whitelist IP Addresses**:
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (allows all IPs - for production)

5. **Get Connection String**:
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kisaan-mandi?retryWrites=true&w=majority`

6. **Add to Environment Variables**:
   - Use this connection string as `MONGODB_URI`

---

## Environment Variables Summary

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kisaan-mandi
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Testing Deployment

After deployment, test these endpoints:
- Health: `https://your-backend-url.com/api/health`
- Test: `https://your-backend-url.com/api/test`

Both should return JSON responses.

