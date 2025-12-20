// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

//dependesncies importing
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Pusher from "pusher";
import bcrypt from "bcryptjs";

import mongomessages from "./messagemodel.js";
import User from "./usermodel.js";

//app config
const app = express();
const port = process.env.PORT || 9000;

//pusher setup
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER || "ap2",
  useTLS: true,
});

//middlewares
app.use(express.json());
app.use(cors());

//db config
const connection_url = process.env.MONGODB_URI;

// Validate connection URL
if (!connection_url) {
  console.error("Mongo connection error: MONGODB_URI environment variable is not set");
  process.exit(1);
}

// Validate connection URL format
const isValidFormat = connection_url.startsWith('mongodb+srv://') || connection_url.startsWith('mongodb://');
if (!isValidFormat) {
  console.error("Mongo connection error: Invalid connection string format");
  console.error("Connection string must be a valid MongoDB Atlas connection string");
  console.error("Get your connection string from MongoDB Atlas → Connect → Connect your application");
  process.exit(1);
}

// Log connection attempt (masked for security)
const maskedUrl = connection_url.replace(/(mongodb\+srv?:\/\/)([^:]+):([^@]+)@/, '$1$2:***@');
console.log("Attempting MongoDB connection to:", maskedUrl);

// Validate cluster name in connection string
if (connection_url.includes('@cluster.mongodb.net') || connection_url.includes('@cluster')) {
  console.error("ERROR: Connection string appears to be incomplete!");
  console.error("The cluster name is missing. It should be something like 'cluster0.xxxxx' not just 'cluster'");
  console.error("Please check your MONGODB_URI environment variable");
  console.error("Get your connection string from MongoDB Atlas → Connect → Connect your application");
  process.exit(1);
}

// Connect with proper options for MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(connection_url, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10s
      retryWrites: true,
      w: 'majority',
    });
    
    console.log("DB connected successfully");

    // Set up a change stream on the native MongoDB collection after DB is connected.
    // Use `mongoose.connection.db.collection(...)` to get the native driver collection.
    try {
      const changeStream = mongoose.connection.db
        .collection("messages")
        .watch();
      // `changeStream` is an EventEmitter-like ChangeStream; attach event listener.
      changeStream.on("change", (change) => {
        pusher.trigger("messages", "newmessages", { change });
      });
      console.log("Change stream initialized for messages collection");
    } catch (err) {
      console.error("Failed to create change stream:", err);
    }
  } catch (err) {
    console.error("Mongo connection error:", err.message);
    console.error("Error details:", err);
    
    // Provide specific guidance based on error type
    if (err.message.includes('ENOTFOUND') || err.message.includes('querySrv')) {
      console.error("\n=== DNS Resolution Error ===");
      console.error("This usually means:");
      console.error("1. Connection string is malformed or incomplete");
      console.error("2. Cluster name is missing or incorrect");
      console.error("3. Check your MONGODB_URI in Render environment variables");
      console.error("\nCurrent connection string (masked):", maskedUrl);
      console.error("\nTo fix:");
      console.error("1. Go to MongoDB Atlas → Connect → Connect your application");
      console.error("2. Copy the FULL connection string provided");
      console.error("3. Replace <password> placeholder with your actual password");
      console.error("4. Replace <database> placeholder with your database name");
      console.error("5. Paste the complete string into Render → Environment → MONGODB_URI");
      console.error("6. Ensure the connection string includes your cluster name (e.g., cluster0.xxxxx)");
    } else if (err.message.includes('authentication')) {
      console.error("\n=== Authentication Error ===");
      console.error("Check your username and password in the connection string");
    } else if (err.message.includes('timeout')) {
      console.error("\n=== Connection Timeout ===");
      console.error("Check MongoDB Atlas Network Access settings");
      console.error("Ensure Render's IP addresses are whitelisted (or use 0.0.0.0/0)");
    }
    
    process.exit(1);
  }
};

connectDB();

//api routes
app.get("/", (req, res) =>
  res.status(200).send("hello this is a messenger backend")
);

// Save or update user (email, username, passwordHash)
app.post("/api/users/save", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "email, username and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedUsername = String(username).trim();

    const passwordHash = await bcrypt.hash(String(password), 10);

    const userDoc = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { email: normalizedEmail, username: trimmedUsername, passwordHash },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: "User saved successfully",
      user: {
        id: userDoc._id,
        email: userDoc.email,
        username: userDoc.username,
      },
    });
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(500).json({ error: "Failed to save user" });
  }
});

app.post("/save/messages", (req, res) => {
  const dbMessage = req.body;
  console.log(dbMessage);
  mongomessages
    .create(dbMessage)
    .then((data) => res.status(201).send(data))
    .catch((err) => res.status(500).send(err));
});

app.get("/retrieve/conversation", (req, res) => {
  mongomessages
    .find()
    .then((data) => {
      // sort messages by timestamp (ascending). timestamps are stored as strings in the schema
      try {
        data.sort((b, a) => new Date(b.timestamp) - new Date(a.timestamp));
      } catch (e) {
        // if parsing fails, leave original order
        console.error("Error sorting messages by timestamp:", e);
      }
      return res.status(200).send(data);
    })
    .catch((err) => res.status(500).send(err));
});

//listen
app.listen(port, () => console.log(`listening on localhost:${port}`));
