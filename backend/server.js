import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/database.js';
import TemperatureService from './services/temperatureService.js';
import router from './routes/index.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(router);

// WebSocket setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['POST']
  }
});

// Initialize temperature service
const temperatureService = new TemperatureService(io);
temperatureService.startGeneration();

// Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});