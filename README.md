RBAC Task Manager

A full-stack Role-Based Access Control (RBAC) Task Management application built with Node.js, Express, MongoDB, React, TailwindCSS, and JWT authentication.
Users can register, login, create tasks, mark them as completed, and delete them. Admins get additional privileges.

🚀 Features
🔐 Authentication & Authorization

JWT-based login & registration

Password hashing using bcrypt

RBAC:

User → Can manage only their tasks

Admin → Can view & manage all users

📝 Task Management

Create tasks with title & description

View your tasks

Mark tasks as completed

Delete tasks

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Frontend | React, Axios, React Router, TailwindCSS |
| Backend  | Node.js, Express.js                     |
| Database | MongoDB, Mongoose                       |
| Auth     | JWT, bcrypt                             |
| Tools    | Postman, VS Code, GitHub                |

📁 Project Structure
rbac-task-manager/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── App.js
│   └── index.js
│
└── README.md

⚙️ Backend Setup
cd backend
npm install
npm start

Create .env file:
PORT=4000
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret_key


🎨 Frontend Setup
cd frontend
npm install
npm start

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/api/v1/auth/register` | Register user     |
| POST   | `/api/v1/auth/login`    | Login user        |
| GET    | `/api/v1/tasks`         | Get all tasks     |
| POST   | `/api/v1/tasks`         | Create task       |
| PATCH  | `/api/v1/tasks/:id`     | Mark as completed |
| DELETE | `/api/v1/tasks/:id`     | Delete task       |

🏁 Conclusion

This project demonstrates implementing RBAC, JWT authentication, and full CRUD operations using MERN stack. Ideal for learning backend authorization concepts.
