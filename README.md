# Khosroshah News Backend

A RESTful API backend for managing news articles, built with Node.js and Express.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MySQL (mysql2)
- **Authentication**: JWT (cookie-based)
- **File Upload**: Multer

## Getting Started

### Prerequisites

- Node.js >= 16
- MySQL

### Installation

```bash
git clone <repository-url>
cd khosroshah_news_backend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Run

```bash
npm start
```

Server starts on port `5000`.

## API Endpoints

### Authentication

| Method | Endpoint      | Description         | Auth |
|--------|---------------|---------------------|------|
| POST   | `/auth/login` | Login (sets cookie) | No   |
| POST   | `/auth/logout`| Logout (clears cookie)| No |
| GET    | `/auth/me`    | Get current user    | Yes  |

### News

| Method | Endpoint                    | Description              | Auth |
|--------|-----------------------------|--------------------------|------|
| POST   | `/api/news`                 | Create news (with image) | No   |
| GET    | `/api/news/all`             | Get all news             | No   |
| GET    | `/api/news/:id`             | Get news by ID           | No   |
| GET    | `/api/news/byTopic/:slug`   | Get news by topic slug   | No   |
| GET    | `/api/news/bySubTopic/:slug`| Get news by subtopic slug| No   |
| GET    | `/api/news/byTag/:slug`     | Get news by tag slug     | No   |
| DELETE | `/api/news/:id`             | Delete news              | No   |

### News Overview

| Method | Endpoint                   | Description                |
|--------|----------------------------|----------------------------|
| GET    | `/api/news-over-view`      | Get news overview          |
| GET    | `/api/news-over-view/byVisit` | Get news overview by visits |

### Tags

| Method | Endpoint      | Description |
|--------|---------------|-------------|
| POST   | `/api/tags`   | Create tag  |
| GET    | `/api/tags`   | Get all tags|

### Topics

| Method | Endpoint        | Description   |
|--------|-----------------|---------------|
| GET    | `/api/topics`   | Get all topics|
| GET    | `/api/topics/:id`| Get topic by ID|

## Project Structure

```
khosroshah_news_backend/
├── server.js                  # Entry point
├── src/
│   ├── app.js                 # Express app setup
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── news.controller.js
│   │   ├── tags.controller.js
│   │   └── topics.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── upload.middleware.js # Multer file upload
│   ├── models/
│   │   ├── news.model.js
│   │   ├── tags.model.js
│   │   └── topics.model.js
│   └── routes/
│       ├── auth.route.js
│       ├── news.route.js
│       ├── newsOverView.route.js
│       ├── tags.route.js
│       └── topics.route.js
└── uploads/                   # Uploaded images
```

## File Upload

Accepted image types: `JPEG`, `PNG`, `WebP`.

Images are uploaded via `multipart/form-data` with the field name `image`.
