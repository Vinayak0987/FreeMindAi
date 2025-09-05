# FreeMind AI - Installation Guide

## Prerequisites

### Required Software
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: Latest version

### System Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: 2GB free space

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/Vinayak0987/FreeMindAi.git
cd FreeMindAi
```

### 2. Install Node.js (if not installed)
- Download from: https://nodejs.org/
- Or use Node Version Manager (nvm):
```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use the required Node version
nvm install 18.17.0
nvm use 18.17.0
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 5. Start Development Server
```bash
npm start
```
The app will open at: http://localhost:4028

### 6. Build for Production
```bash
npm run build
```

### 7. Start Backend Server (Optional)
```bash
npm run server
```
Backend will run at: http://localhost:3001

## Package List

### Core Dependencies
- **react**: ^18.2.0 - UI Framework
- **react-dom**: ^18.2.0 - React DOM Renderer  
- **react-router-dom**: 6.0.2 - Routing
- **vite**: 5.0.0 - Build Tool
- **tailwindcss**: 3.4.6 - CSS Framework

### UI Components
- **@radix-ui/react-slot**: ^1.2.3 - Headless UI components
- **lucide-react**: ^0.484.0 - Icons
- **framer-motion**: ^10.16.4 - Animations
- **class-variance-authority**: ^0.7.1 - Component variants
- **clsx**: ^2.1.1 - Conditional classes
- **tailwind-merge**: ^3.3.1 - Tailwind class merging

### Authentication
- **@react-oauth/google**: ^0.12.2 - Google OAuth
- **jsonwebtoken**: ^9.0.2 - JWT handling
- **bcryptjs**: ^3.0.2 - Password hashing

### Backend
- **express**: ^5.1.0 - Web framework
- **mongoose**: ^8.18.0 - MongoDB ODM  
- **cors**: ^2.8.5 - CORS handling
- **dotenv**: ^16.6.1 - Environment variables

### State Management
- **@reduxjs/toolkit**: ^2.6.1 - Redux toolkit
- **redux**: ^5.0.1 - State management

### Form Handling
- **react-hook-form**: ^7.55.0 - Form management
- **express-validator**: ^7.2.1 - Server-side validation

### Data Visualization
- **recharts**: ^2.15.2 - Charts and graphs
- **d3**: ^7.9.0 - Data visualization

### Development Tools
- **@vitejs/plugin-react**: 4.3.4 - Vite React plugin
- **autoprefixer**: 10.4.2 - CSS autoprefixer
- **postcss**: 8.4.8 - CSS post-processor
- **concurrently**: ^9.2.1 - Run multiple commands
- **nodemon**: ^3.1.10 - Auto-restart server

## Scripts Available

```bash
npm start          # Start development server
npm run build      # Build for production  
npm run serve      # Preview production build
npm run server     # Start backend server
npm run dev:server # Start backend in development mode
npm run dev        # Start both frontend and backend
```

## Troubleshooting

### Common Issues

**1. Node version mismatch:**
```bash
nvm use 18.17.0
```

**2. Port already in use:**
```bash
# Kill process on port 4028
npx kill-port 4028
```

**3. Package installation errors:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. Build errors:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

## Support

For issues and questions:
- Create an issue on GitHub: https://github.com/Vinayak0987/FreeMindAi/issues
- Contact: TeamAntiMatter

---

**FreeMind AI** - Intelligent ML Platform 🧠
