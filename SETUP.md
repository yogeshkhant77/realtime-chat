# Environment Setup Guide

## Security Note

This project contains sensitive environment variables that should **NEVER** be committed to version control.

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd messenger-backend
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and fill in your actual credentials:

   ```
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/messengerdb?retryWrites=true&w=majority

   # Pusher Configuration
   PUSHER_APP_ID=YOUR_APP_ID
   PUSHER_KEY=YOUR_KEY
   PUSHER_SECRET=YOUR_SECRET
   PUSHER_CLUSTER=YOUR_CLUSTER

   # Server Configuration
   PORT=9000
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd messenger-mern-starter-project
   ```

2. Copy the example environment file:

   ```bash
   cp src/.env.example src/.env
   ```

3. Edit `.env` and fill in your Firebase credentials:

   ```
   REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
   REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
   REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
   REACT_APP_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## Important Security Notes

- **Never commit .env files** - They contain sensitive credentials
- `.gitignore` is configured to exclude .env files automatically
- Always use `.env.example` as a template for setup
- Rotate and revoke any exposed credentials immediately
- Use strong, unique passwords for database and service credentials

## Generating Credentials

### MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a project and cluster
3. Under "Connect", copy the connection string
4. Replace `<username>`, `<password>`, and database name as needed

### Pusher Configuration

1. Go to [Pusher Console](https://dashboard.pusher.com)
2. Create an app
3. Copy App ID, Key, Secret, and Cluster from "App Keys"

### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project
3. In Project Settings, copy your Web SDK credentials
