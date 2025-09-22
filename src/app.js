// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const newsRoutes = require('./routes/news.route')
const tagsRouter = require('./routes/tags.route')
const topicRouter = require('./routes/topics.route')
const newsOverViewRouter = require('./routes/newsOverView.route')
const authRouter = require('./routes/auth.route')
// Import routes

const app = express();

// Middlewares
const allowedOrigins = ['http://localhost:4000', 'https://backend.navayetabriz.ir'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // important if you're using cookies (JWT in HttpOnly cookie)
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

//
app.use('/auth', authRouter);
app.use('/api/news', newsRoutes);
app.use('/api/tags', tagsRouter)
app.use('/api/topics', topicRouter)
app.use('/api/news-over-view', newsOverViewRouter)


// Default route

module.exports = app;
