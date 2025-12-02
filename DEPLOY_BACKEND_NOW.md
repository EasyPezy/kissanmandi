# 🚀 Deploy Backend Now - Step by Step

## Why No Data?
The frontend is working, but it needs the backend API to fetch data. The backend needs to be deployed to a hosting service.

---

## Step 1: Set Up MongoDB Atlas (5 minutes)

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** for a free account
3. **Create a Free Cluster**:
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a region close to you
   - Click "Create"

4. **Create Database User**:
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `kisaanmandi` (or any username)
   - Password: Create a strong password (SAVE THIS!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

5. **Whitelist IP Addresses**:
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
   - Click "Confirm"

6. **Get Connection String**:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **IMPORTANT**: Replace `<username>` and `<password>` with your actual credentials
   - Add database name at the end: `...mongodb.net/kisaan-mandi?retryWrites=true&w=majority`
   - **Example**: `mongodb+srv://kisaanmandi:MyPassword123@cluster0.abc123.mongodb.net/kisaan-mandi?retryWrites=true&w=majority`
   - **SAVE THIS STRING** - you'll need it!

---

## Step 2: Deploy Backend to Railway (10 minutes)

### Option A: Railway (Easiest)

1. **Go to**: https://railway.app
2. **Sign in** with GitHub
3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `kissanmandi` repository
   - Click "Deploy Now"

4. **Configure Root Directory**:
   - Click on the service that was created
   - Go to "Settings" tab
   - Scroll to "Root Directory"
   - Set to: `backend`
   - Click "Save"

5. **Add Environment Variables**:
   - Go to "Variables" tab
   - Click "New Variable" and add each one:

   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string_from_step_1
   GEMINI_API_KEY=your_gemini_api_key_here
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

   **Replace**:
   - `your_mongodb_connection_string_from_step_1` with the MongoDB URI you saved
   - `your-frontend.vercel.app` with your actual Vercel frontend URL

6. **Generate Domain**:
   - Go to "Settings" tab
   - Scroll to "Domains"
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://kisaan-mandi-backend-production.up.railway.app`)

7. **Wait for Deployment**:
   - Railway will automatically deploy
   - Check the "Deployments" tab to see progress
   - Wait for "Deploy Successful" ✅

8. **Test Backend**:
   - Open: `https://your-railway-url.railway.app/api/health`
   - Should return: `{"status":"OK","message":"Kisaan Mandi API is running",...}`
   - Open: `https://your-railway-url.railway.app/api/test`
   - Should return: `{"message":"Backend is working!"}`

---

## Step 3: Connect Frontend to Backend (2 minutes)

1. **Go to Vercel Dashboard**: https://vercel.com
2. **Select your project**
3. **Go to Settings** → **Environment Variables**
4. **Add New Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-url.railway.app/api`
   - Replace `your-railway-url.railway.app` with your actual Railway URL
   - Environment: Production, Preview, Development (select all)
   - Click "Save"

5. **Redeploy Frontend**:
   - Go to "Deployments" tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"
   - Wait for deployment to complete

---

## Step 4: Verify Data is Loading

1. **Wait 1-2 minutes** after backend deployment (for data seeding)
2. **Visit your Vercel site**
3. **Check the pages**:
   - Home page should show farm/crop counts
   - Farms page should show a list of farms
   - Heatmap should show map markers
   - Crop Stats should show crop data

---

## Troubleshooting

### Backend not responding?
- Check Railway deployment logs for errors
- Verify MongoDB connection string is correct
- Make sure all environment variables are set

### Still no data?
- Wait a few minutes - data seeding takes time
- Check Railway logs to see if data was seeded
- Verify MongoDB connection is working

### Frontend can't connect?
- Verify `VITE_API_URL` is set correctly in Vercel
- Make sure you redeployed after adding the variable
- Check browser console (F12) for API errors

---

## Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created (free tier)
- [ ] Database user created
- [ ] IP whitelisted (0.0.0.0/0)
- [ ] Connection string copied and formatted correctly
- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] Root directory set to `backend`
- [ ] All environment variables added
- [ ] Railway domain generated
- [ ] Backend health check works
- [ ] Vercel environment variable `VITE_API_URL` added
- [ ] Frontend redeployed
- [ ] Data appears on website

---

**Once deployed, the backend will automatically create 200 farms with synthetic data!** 🎉

