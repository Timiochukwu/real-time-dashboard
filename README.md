# Real-time Dashboard

A modern real-time dashboard application built with Next.js frontend and Node.js backend, featuring real-time data visualization, authentication, and interactive components.

## 🚀 Features

- Real-time data updates using Socket.IO
- Interactive dashboard with data visualization
- User authentication and authorization
- Responsive design with Tailwind CSS
- MongoDB database integration
- Redis caching for improved performance
- RESTful API architecture
- TypeScript support for both frontend and backend

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Socket.IO Client
- React Context for state management
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Redis for caching
- Socket.IO for real-time updates
- JWT for authentication
- Joi for request validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB
- Redis
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Timiochukwu/real-time-dashboard.git
cd real-time-dashboard
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:

Create `.env` in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/realtime-dashboard
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

Create `.env` in the frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 🚀 Running the Application

1. Start MongoDB and Redis services

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
realtime-dashboard/
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── lib/           # Utility functions and API clients
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
├── backend/                # Node.js backend server
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── scripts/       # Utility scripts
│   └── dist/             # Compiled TypeScript files
└── package.json          # Root package.json
```

## 🛠️ Development

### Backend Development
- Built with Node.js and Express
- RESTful API architecture
- MongoDB database integration
- WebSocket support for real-time updates
- Redis caching for improved performance
- JWT-based authentication
- Request validation with Joi

### Frontend Development
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Real-time updates with Socket.IO
- Responsive design
- Component-based architecture
- Context API for state management

## 📝 API Documentation

API documentation will be available in future updates. For now, please refer to the source code in the `backend/src/routes` directory for endpoint details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
