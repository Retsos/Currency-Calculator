# 💱 Currency Calculator

A full-stack currency exchange web application where:

* 🧑 Users can **convert currencies** using the latest available rates.
* 🛠️ Admins can **add new currencies** and **manage exchange rates** via a dedicated admin panel.

---

## 🚀 Technologies Used

### Frontend

* React JS
* React Hook Form
* Zustand (state management)
* Material UI (MUI)

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JSON Web Tokens (JWT)

---

## 📁 Project Structure

```
root/
├── Currency_Calculator/       # React frontend
├── server/       # Express backend
└── README.md
```

---

## 🌱 Environment Variables

### Backend - `/server/.env`

Create a `.env` file in the `server` folder with the following:

```env
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
BACKEND_PORT=3000
FRONTEND_PORT=5173
```

## 🛠️ How to Run the App Locally

### 1. Clone the repository

```bash
git clone https://github.com/Retsos/currency-calculator.git
cd currency-calculator
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Set up `.env` files

Create the `.env` files as shown above.

### 4. Run the app

In two separate terminals:

```bash
# Terminal 1: backend
cd server
npm run devStart

# Terminal 2: frontend
cd client
npm run dev
```

## 📌 Features

### User View

* 💱 Currency conversion (including intermediate conversions)
* 🔍 Real-time feedback and errors

### Admin Panel

* ➕ Add new currencies
* ✏️ Add/edit/delete exchange rates
* 🔐 Protected routes

---

## ✍️ Author

Made by Gewrgios Retsilas

---

## 📄 License

MIT License
