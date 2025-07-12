# ♻️ ReWear – Community Clothing Exchange 👕

Welcome to **ReWear**, your sustainable solution to fast fashion. ReWear helps people **donate, discover, and reuse clothes** in their local community while earning points!

---

## 🌟 Features

- 🔐 Secure JWT-based Login / Signup
- 📦 Browse & Add Clothing Listings
- 🧑‍💼 Admin Role for Moderation
- 🪙 Earn Points for Contributions
- 🎨 Clean UI with Tailwind CSS

---

## 🛠️ How to Run ReWear (Dev Setup)

Follow these steps to launch the app locally:

### ⚙️ Prerequisites

- Node.js (v18+)
- MongoDB (Atlas or local)
- Git (basic understanding)
- A good mood 😄

---

### 🧩 Step 1: Clone the Repo

```bash
git clone https://github.com/your-username/rewear.git
cd rewear
🔙 Step 2: Setup Backend
bash
Copy
Edit
cd server
npm install
Create a .env file in the server/ directory:

env
Copy
Edit
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
Then start the server:

bash
Copy
Edit
nodemon server.js
# or, if nodemon is not installed
node server.js
✅ Backend running at: http://localhost:5000

🖼️ Step 3: Setup Frontend (Next.js 14)
bash
Copy
Edit
cd ../client
npm install
npm run dev
✅ Frontend running at: http://localhost:3000

📂 Project Structure
bash
Copy
Edit
rewear/
├── client/           # Next.js frontend
│   ├── app/          # App routes (dashboard, items, login, signup, etc.)
│   ├── components/   # Reusable components
│   ├── lib/          # Axios client, API utils
│   ├── styles/       # Tailwind + global CSS
│   └── public/       # Static assets
├── server/           # Express backend
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Auth & item routes
│   ├── middleware/   # JWT auth middleware
│   └── server.js     # Server entry
├── .env              # Secret keys (MongoDB, JWT)
├── README.md         # This file
🧪 Sample User for Testing
json
Copy
Edit
{
  "email": "testuser@example.com",
  "password": "test1234"
}

---

✅ **Next Step:** Paste this into your `README.md` file, then run:

```bash
git add README.md
git commit -m "Add creative README.md"

