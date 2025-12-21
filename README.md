# 💬 Real-Time Messenger App

A full-stack real-time messaging application built with the MERN stack (MongoDB, Express, React, Node.js), featuring instant message delivery powered by Pusher and Firebase Authentication.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-16.13.1-blue.svg)

## ✨ Features

- 🔐 **Firebase Authentication** - Secure user authentication with email and password
- 💬 **Real-Time Messaging** - Instant message delivery using Pusher WebSockets
- 👤 **User Management** - User registration and profile management
- 🎨 **Modern UI** - Built with Material-UI for a beautiful, responsive interface
- 🔄 **Live Updates** - Messages appear instantly without page refresh
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔒 **Secure** - Password hashing with bcrypt, environment variable protection
- ⚡ **Fast & Efficient** - Optimized for performance with MongoDB and Express

## 🛠️ Tech Stack

### Frontend
- **React** 16.13.1 - UI library
- **Material-UI** - Component library
- **Pusher-js** - Real-time WebSocket communication
- **Firebase** - Authentication service
- **Axios** - HTTP client
- **React Flip Move** - Smooth message animations

### Backend
- **Node.js** - Runtime environment
- **Express** 5.1.0 - Web framework
- **MongoDB** with **Mongoose** - Database and ODM
- **Pusher** - Real-time messaging service
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB Atlas** account (free tier works)
- **Pusher** account (free tier available)
- **Firebase** project (free tier available)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yogeshkhant77/realtime-chat.git
cd realtime-chat
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd messenger-backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env

# Edit .env file with your credentials (see Configuration section)
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../messenger-mern-starter-project

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env

# Edit .env file with your credentials (see Configuration section)
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd messenger-backend
npm start
# Server runs on http://localhost:9000
```

**Terminal 2 - Frontend:**
```bash
cd messenger-mern-starter-project
npm start
# App opens on http://localhost:3000
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in `messenger-backend/` directory:

```env
# MongoDB Connection String
MONGODB_URI=your mongodb uri

# Server Port
PORT=9000

# Pusher Configuration
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=ap2
```

### Frontend Environment Variables

Create a `.env` file in `messenger-mern-starter-project/` directory:

```env
# Pusher Configuration (for real-time messaging)
REACT_APP_PUSHER_KEY=your_pusher_key
REACT_APP_PUSHER_CLUSTER=ap2

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

### Getting Your Credentials

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string from "Connect" → "Connect your application"

#### Pusher
1. Go to [Pusher Dashboard](https://dashboard.pusher.com)
2. Create a new app
3. Go to "App Keys" tab
4. Copy App ID, Key, Secret, and Cluster

#### Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Go to Project Settings → General
5. Scroll down to "Your apps" and add a web app
6. Copy the configuration values

## 📡 API Endpoints

### Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check endpoint |
| POST | `/api/users/save` | Save or update user information |
| POST | `/save/messages` | Save a new message |
| GET | `/retrieve/conversation` | Retrieve all messages |

### Example API Usage

**Save User:**
```bash
POST http://localhost:9000/api/users/save
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}
```

**Save Message:**
```bash
POST http://localhost:9000/save/messages
Content-Type: application/json

{
  "message": "Hello, World!",
  "name": "John Doe",
  "timestamp": "2024-01-01T12:00:00Z",
  "received": false
}
```

**Retrieve Messages:**
```bash
GET http://localhost:9000/retrieve/conversation
```

## 📁 Project Structure

```
realtime-chat/
├── messenger-backend/          # Backend server
│   ├── server.js               # Main server file
│   ├── messagemodel.js         # Message schema
│   ├── usermodel.js            # User schema
│   ├── package.json            # Backend dependencies
│   ├── .env                    # Environment variables (not in git)
│   └── .env.example            # Environment template
│
├── messenger-mern-starter-project/  # Frontend React app
│   ├── src/
│   │   ├── App.js              # Main React component
│   │   ├── Message.js          # Message component
│   │   ├── axios.js            # API configuration
│   │   └── firebase.js         # Firebase config
│   ├── public/                 # Static files
│   ├── package.json            # Frontend dependencies
│   ├── .env                    # Environment variables (not in git)
│   └── .env.example            # Environment template
│
├── .gitignore                  # Git ignore rules
├── .gitattributes              # Line ending configuration
├── SECURITY_CHECKLIST.md       # Security guidelines
├── SETUP.md                    # Detailed setup guide
└── README.md                   # This file
```

## 🔒 Security

This project follows security best practices:

- ✅ Environment variables for sensitive data
- ✅ Password hashing with bcrypt
- ✅ `.env` files excluded from version control
- ✅ CORS enabled for secure cross-origin requests
- ✅ Input validation and sanitization

**Important:** Never commit `.env` files or expose credentials. See [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) for detailed security guidelines.

## 🧪 Development

### Backend Development

```bash
cd messenger-backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

```bash
cd messenger-mern-starter-project
npm start    # Runs on http://localhost:3000
```

### Building for Production

**Frontend:**
```bash
cd messenger-mern-starter-project
npm run build
```

The build folder will contain the optimized production build.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB Atlas connection string
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database user has proper permissions

### Pusher Connection Issues
- Verify your Pusher credentials in `.env`
- Check Pusher dashboard for app status
- Ensure cluster name matches (e.g., "ap2")

### Firebase Authentication Issues
- Verify Firebase credentials in frontend `.env`
- Ensure Email/Password authentication is enabled in Firebase Console
- Check Firebase project settings

### Port Already in Use
- Backend default port: 9000
- Frontend default port: 3000
- Change ports in `.env` or `package.json` if needed

### Windows PowerShell Issues
- Use `cross-env` for environment variables (already configured)
- Use `;` instead of `&&` for command chaining in PowerShell

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**yk studios**

- GitHub: [@yogeshkhant77](https://github.com/yogeshkhant77)
- Repository: [realtime-chat](https://github.com/yogeshkhant77/realtime-chat)

## 🙏 Acknowledgments

- [Pusher](https://pusher.com/) for real-time messaging infrastructure
- [Firebase](https://firebase.google.com/) for authentication services
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- [Material-UI](https://material-ui.com/) for UI components

## 📚 Additional Resources

- [Detailed Setup Guide](SETUP.md)
- [Security Checklist](SECURITY_CHECKLIST.md)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Pusher Documentation](https://pusher.com/docs/)

---

⭐ If you find this project helpful, please consider giving it a star!
