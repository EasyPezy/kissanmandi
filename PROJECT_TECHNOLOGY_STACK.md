# Complete Technology Stack - Kisaan Mandi Project

## 📋 Overview
This document lists all technologies, libraries, tools, and services used in the Kisaan Mandi project.

---

## 🎯 Core Technologies

### Programming Languages
- **JavaScript (ES6+)** - Primary language for both frontend and backend
- **JSX** - React syntax extension for UI components

### Runtime Environment
- **Node.js** - JavaScript runtime for backend server

---

## 🖥️ Frontend Stack

### Framework & Library
- **React 18.2.0** - UI library for building user interfaces
- **React DOM 18.2.0** - React renderer for web

### Routing
- **React Router DOM 6.20.1** - Client-side routing for single-page applications

### Build Tools
- **Vite 5.0.8** - Fast build tool and development server
- **@vitejs/plugin-react 4.2.1** - Vite plugin for React support

### Styling
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **PostCSS 8.4.32** - CSS processing tool
- **Autoprefixer 10.4.16** - Automatically adds vendor prefixes to CSS

### HTTP Client
- **Axios 1.6.2** - Promise-based HTTP client for API requests

### Maps & Visualization
- **Leaflet 1.9.4** - Open-source JavaScript library for mobile-friendly interactive maps
- **React Leaflet 4.2.1** - React components for Leaflet maps

### Real-time Communication
- **Socket.io Client 4.6.1** - Client library for real-time bidirectional communication

### Type Definitions (Development)
- **@types/react 18.2.43** - TypeScript definitions for React
- **@types/react-dom 18.2.17** - TypeScript definitions for React DOM

---

## ⚙️ Backend Stack

### Web Framework
- **Express 4.18.2** - Fast, unopinionated web framework for Node.js

### Database
- **MongoDB** - NoSQL document database
- **Mongoose 8.0.3** - MongoDB object modeling tool for Node.js

### AI Integration
- **@google/generative-ai 0.2.1** - Google Gemini AI SDK for AI-powered features

### HTTP Client
- **Axios 1.6.2** - HTTP client for external API calls

### Real-time Communication
- **Socket.io 4.6.1** - Real-time bidirectional event-based communication

### Middleware & Utilities
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware
- **dotenv 16.3.1** - Loads environment variables from .env file

---

## 🛠️ Development Tools

### Process Management
- **Concurrently 8.2.2** - Run multiple commands concurrently (dev dependency)

### Version Control
- **Git** - Distributed version control system
- **GitHub** - Code hosting platform

---

## ☁️ Deployment & Hosting

### Frontend Hosting
- **Vercel** - Platform for frontend deployment
  - Automatic deployments from GitHub
  - Environment variable management
  - Custom domain support

### Backend Hosting Options
- **Railway** - Platform for backend deployment (recommended)
  - Automatic deployments from GitHub
  - Environment variable management
  - Free tier available
- **Render** - Alternative backend hosting platform
  - Free tier available
  - Automatic deployments

### Database Hosting
- **MongoDB Atlas** - Cloud database service
  - Free tier (M0) available
  - Automatic backups
  - Global clusters

---

## 🔌 External APIs & Services

### AI Services
- **Google Gemini AI API** - For crop yield predictions and recommendations
  - Model: gemini-pro
  - Used for: AI predictions, crop recommendations

### Weather Services
- **Open-Meteo API** - Free weather API (no API key required)
  - Used for: Weather data and forecasts

### Map Services
- **OpenStreetMap** - Free, open-source map tiles
  - Used via Leaflet for interactive maps

---

## 📦 Project Structure

### Backend Structure
```
backend/
├── models/          # MongoDB schemas
│   ├── Buyer.js
│   ├── Chat.js
│   ├── Crop.js
│   └── Farm.js
├── routes/          # API endpoints
│   ├── ai.js        # AI prediction routes
│   ├── buyers.js    # Buyer management
│   ├── chat.js      # Chat/messaging
│   ├── crops.js     # Crop data
│   ├── farms.js     # Farm data
│   └── weather.js   # Weather data
├── utils/           # Utility functions
│   ├── mockData.js  # Fallback mock data
│   └── seedData.js  # Database seeding
├── server.js        # Main server file
├── package.json
├── Procfile         # Railway deployment config
├── railway.json     # Railway configuration
└── render.yaml      # Render deployment config
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── BackendStatus.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Navbar.jsx
│   │   └── WeatherWidget.jsx
│   ├── context/         # React Context
│   │   └── LanguageContext.jsx
│   ├── pages/           # Page components
│   │   ├── AIPrediction.jsx
│   │   ├── Chat.jsx
│   │   ├── CropStats.jsx
│   │   ├── Farms.jsx
│   │   ├── Heatmap.jsx
│   │   └── Home.jsx
│   ├── utils/           # Utilities
│   │   ├── api.js       # API client configuration
│   │   └── translations.js  # Multi-language support
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── vercel.json          # Vercel deployment config
```

---

## 🌐 Features & Capabilities

### Frontend Features
- ✅ Single Page Application (SPA)
- ✅ Client-side routing
- ✅ Multi-language support (English, Hindi, Punjabi, Kannada)
- ✅ Responsive design (mobile-friendly)
- ✅ Interactive maps with Leaflet
- ✅ Real-time updates capability
- ✅ Error boundaries for error handling
- ✅ Loading states and error messages

### Backend Features
- ✅ RESTful API
- ✅ MongoDB database integration
- ✅ AI-powered predictions (Gemini)
- ✅ Real-time chat support (Socket.io)
- ✅ Weather data integration
- ✅ Automatic data seeding
- ✅ CORS enabled for frontend
- ✅ Error handling middleware

---

## 🔐 Environment Variables

### Backend Required Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend Optional Variables
- `VITE_API_URL` - Backend API URL (defaults to /api for proxy)

---

## 📚 Key Libraries & Their Purpose

| Library | Purpose |
|---------|---------|
| **React** | UI component library |
| **React Router** | Client-side routing |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Axios** | HTTP requests |
| **Express** | Backend web framework |
| **Mongoose** | MongoDB ODM |
| **Socket.io** | Real-time communication |
| **Leaflet** | Interactive maps |
| **Google Gemini AI** | AI predictions |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin resource sharing |

---

## 🎨 Styling Approach

- **Tailwind CSS** - Utility-first CSS framework
- **Custom Color Palette** - Primary green theme (agricultural theme)
- **Responsive Design** - Mobile-first approach
- **Component-based Styling** - Styled components with Tailwind classes

---

## 🔄 Data Flow

1. **Frontend** (React) → Makes API calls via Axios
2. **Backend** (Express) → Receives requests, processes with Mongoose
3. **Database** (MongoDB) → Stores and retrieves data
4. **External APIs** → Gemini AI, Weather APIs
5. **Real-time** → Socket.io for chat functionality

---

## 📱 Supported Browsers

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

---

## 🚀 Deployment Architecture

```
GitHub Repository
    ↓
    ├── Frontend → Vercel (Automatic deployment)
    └── Backend → Railway/Render (Automatic deployment)
            ↓
        MongoDB Atlas (Database)
```

---

## 📝 Development Workflow

1. **Local Development**
   - Frontend: `npm run dev` (Vite dev server on port 3000)
   - Backend: `npm run dev` (Express server on port 5000)
   - Both: `npm run dev` (runs concurrently)

2. **Production Build**
   - Frontend: `npm run build` (creates `dist/` folder)
   - Backend: `npm start` (runs production server)

3. **Deployment**
   - Push to GitHub → Automatic deployment
   - Environment variables configured in hosting platforms

---

## 🔧 Configuration Files

- `package.json` - Root project configuration
- `backend/package.json` - Backend dependencies
- `frontend/package.json` - Frontend dependencies
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `vercel.json` - Vercel deployment configuration
- `railway.json` - Railway deployment configuration
- `render.yaml` - Render deployment configuration
- `Procfile` - Railway process configuration
- `.gitignore` - Git ignore rules
- `.env.example` - Environment variable template

---

## 📊 Project Statistics

- **Total Dependencies**: ~25 packages
- **Frontend Pages**: 6 pages
- **Backend Routes**: 6 route files
- **Database Models**: 4 models
- **Languages Supported**: 4 languages
- **API Endpoints**: 15+ endpoints

---

## 🎯 Key Features Implementation

1. **Multi-language Support** - React Context API
2. **Error Handling** - Error boundaries and try-catch
3. **Loading States** - React useState hooks
4. **API Integration** - Centralized Axios instance
5. **Real-time Updates** - Socket.io (prepared)
6. **Map Integration** - Leaflet with OpenStreetMap
7. **AI Integration** - Google Gemini API
8. **Database Seeding** - Automatic on first run

---

This is a complete, production-ready full-stack application with modern technologies and best practices! 🚀

