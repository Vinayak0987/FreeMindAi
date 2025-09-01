# FreeMind AI - Vercel Deployment Guide

## 🚀 Deployment Checklist

### ✅ Pre-deployment Setup Complete
- [x] Vercel configuration (`vercel.json`) created
- [x] API routes structured for serverless functions (`api/index.js`)
- [x] Server.js modified for Vercel compatibility
- [x] Build scripts configured
- [x] Environment variables template created

### 📋 Next Steps to Deploy

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Import in Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it as a Vite project

3. **Set Environment Variables in Vercel Dashboard:**
   Copy the variables from `.env.example` and set them with your actual values:
   
   **Required Environment Variables:**
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret-key
   NODE_ENV=production
   VITE_API_URL=https://your-app-name.vercel.app/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   
   # Add your actual API keys
   VITE_OPENAI_API_KEY=your-openai-api-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   VITE_ANTHROPIC_API_KEY=your-anthropic-api-key
   VITE_GOOGLE_ANALYTICS_ID=your-google-analytics-id
   VITE_ADSENSE_ID=your-adsense-id
   VITE_PERPLEXITY_API_KEY=your-perplexity-api-key
   VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

4. **Deploy!**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-app-name.vercel.app`

5. **Post-deployment:**
   - Update `VITE_API_URL` environment variable in Vercel to your actual domain
   - Redeploy to apply the changes

#### Option 2: Deploy via CLI

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Set environment variables:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add NODE_ENV
   vercel env add VITE_GOOGLE_CLIENT_ID
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## 🔧 Architecture Overview

### Frontend (Vite + React)
- Built as static files in `/dist`
- Served by Vercel's CDN
- Environment variables prefixed with `VITE_`

### Backend (Express API)
- Converted to Vercel serverless functions
- Entry point: `/api/index.js`
- Routes: All `/api/*` requests handled by Express app

### Database
- MongoDB Atlas (cloud-hosted)
- Connection remains the same as development

## 🔍 Testing Your Deployment

After deployment, test these endpoints:
- `https://your-app.vercel.app/` - Frontend
- `https://your-app.vercel.app/api/health` - Backend health check
- `https://your-app.vercel.app/api/auth/login` - Auth endpoint

## 📝 Notes

1. **Environment Variables**: All `VITE_*` variables are embedded in the frontend build
2. **Serverless Functions**: API routes run as serverless functions (cold starts possible)
3. **CORS**: Configured to allow your Vercel domain
4. **MongoDB**: Using existing Atlas connection
5. **Static Files**: React app served as static files

## 🐛 Troubleshooting

### Common Issues:
1. **API not working**: Check environment variables are set in Vercel dashboard
2. **CORS errors**: Ensure your domain is in the CORS allowlist
3. **Build failures**: Check all dependencies are in package.json
4. **Database connection**: Verify MongoDB Atlas allows connections from Vercel IPs

### Logs:
- View function logs in Vercel dashboard under "Functions" tab
- Check build logs for compilation errors
