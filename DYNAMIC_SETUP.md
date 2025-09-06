# FreeMind AI - Dynamic Content Setup Guide

This guide will help you set up the FreeMind AI platform with dynamic content using MongoDB for data storage and Cloudinary for file management.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **Cloudinary Account** (free tier available)

### 1. Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update your `.env` file with the required credentials:

```env
# Backend Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/freemind-ai
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (Required for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key  
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:4028
```

### 2. MongoDB Setup

#### Option A: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string and update `MONGODB_URI` in `.env`

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Update `MONGODB_URI` to: `mongodb://localhost:27017/freemind-ai`

### 3. Cloudinary Setup

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy your **Cloud Name**, **API Key**, and **API Secret**
4. Update the Cloudinary variables in your `.env` file

### 4. Install Dependencies

```bash
npm install
```

### 5. Seed Sample Data

Populate your database with sample templates and data:

```bash
npm run seed:templates
```

### 6. Start the Application

#### Development Mode (Full Stack)
```bash
npm run dev
```

#### Or start individually:

Backend server:
```bash
npm run dev:server
```

Frontend (in another terminal):
```bash
npm start
```

## 🎯 Features Implemented

### Dynamic Content Management

1. **Projects**: Full CRUD operations with image uploads
2. **Activities**: Real-time activity tracking  
3. **Training Jobs**: ML model training management
4. **Templates**: Quick-start project templates
5. **File Uploads**: Image and dataset management via Cloudinary

### API Endpoints

- `POST /api/projects` - Create project with thumbnail upload
- `GET /api/projects` - List projects with filtering/sorting
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/activities/recent` - Recent activities
- `GET /api/training/active` - Active training jobs
- `GET /api/templates/popular` - Popular templates

### Frontend Integration

- Dynamic data loading with React hooks
- Loading states and error handling
- Real-time updates after CRUD operations
- File upload with progress indication

## 🔧 Configuration

### File Upload Settings

The system supports different file types with size limits:

- **Images**: 10MB (PNG, JPG, GIF, WebP)
- **Datasets**: 100MB (CSV, JSON, TXT, ZIP)  
- **Models**: 500MB (H5, PB, ONNX, PKL)
- **Media**: 200MB (MP4, MP3, WAV, AVI)

### Database Models

- **Project**: Name, description, status, progress, thumbnail, tags
- **Activity**: Type, description, user, project, timestamp
- **TrainingJob**: Model name, status, progress, configuration
- **Template**: Name, description, code, requirements, usage stats
- **Dataset**: Files, metadata, preprocessing steps

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string format
   - Verify network access (IP whitelist for Atlas)
   - Ensure database user has proper permissions

2. **Cloudinary Upload Fails**
   - Verify API credentials are correct
   - Check file size limits
   - Ensure file types are allowed

3. **CORS Issues**
   - Update `FRONTEND_URL` in `.env`
   - Check if frontend and backend ports match

### Debug Commands

Check MongoDB connection:
```bash
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('✅ MongoDB Connected')).catch(err => console.error('❌', err))"
```

Test Cloudinary:
```bash
node -e "const cloudinary = require('cloudinary').v2; cloudinary.config({cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET}); cloudinary.api.ping().then(() => console.log('✅ Cloudinary Connected')).catch(err => console.error('❌', err))"
```

## 📂 Project Structure

```
FreeMindAi/
├── server/
│   ├── config/
│   │   └── cloudinary.js        # File upload configuration
│   ├── models/
│   │   ├── Project.js           # Project schema
│   │   ├── Activity.js          # Activity schema
│   │   ├── TrainingJob.js       # Training job schema
│   │   └── Template.js          # Template schema
│   ├── routes/
│   │   ├── projects.js          # Project API routes
│   │   ├── activities.js        # Activity API routes  
│   │   ├── training.js          # Training API routes
│   │   └── templates.js         # Template API routes
│   ├── seeders/
│   │   └── templates.js         # Sample data seeder
│   └── server.js                # Express server
├── src/
│   ├── hooks/
│   │   └── useApi.js            # API data fetching hooks
│   ├── utils/
│   │   └── api.js               # API service utilities
│   └── pages/dashboard/
│       └── index.jsx            # Updated dynamic dashboard
└── .env.example                 # Environment template
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

### Production Environment Variables

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
VERCEL_URL=your-app.vercel.app
```

## 🔄 Migration from Static to Dynamic

The platform has been updated to replace all static content with dynamic data:

- ✅ Dashboard metrics now come from MongoDB
- ✅ Projects are stored and retrieved dynamically
- ✅ Activities are logged automatically
- ✅ Training jobs are tracked in real-time
- ✅ Templates are managed via database
- ✅ File uploads handled by Cloudinary

## 📚 API Documentation

### Authentication

All API endpoints require authentication via JWT token:

```javascript
Authorization: Bearer <your-jwt-token>
```

### Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
```

## 🔐 Security

- JWT tokens for authentication
- Input validation on all endpoints
- File type and size restrictions
- Environment variable protection
- CORS configuration

## 📈 Performance

- Database indexing for fast queries
- Image optimization via Cloudinary
- Lazy loading of components
- API response caching
- Efficient pagination

---

**Need Help?** Open an issue on GitHub or check the troubleshooting section above.
