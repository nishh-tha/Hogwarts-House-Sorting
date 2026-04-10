# 🧙 Hogwarts Sorting Hat (Full-Stack Project)

A full-stack web application that assigns users to Hogwarts houses based on personality-driven quiz responses, powered by a **Neo4j graph database** and a **Node.js backend**.

---

## 🚀 Live Demo

*(Add your deployed links here after deployment)*
Frontend: https://your-frontend.vercel.app
Backend API: https://your-backend.onrender.com

---

## 🧠 Project Overview

This project simulates the iconic Hogwarts Sorting Hat using a **trait-based classification system**. Instead of simple condition checks, it leverages **graph relationships** to store and query user data dynamically.

Users answer a series of personality-based questions, and the system:

* Calculates house affinity
* Stores results in a graph database
* Displays a real-time leaderboard
* Provides house-wise analytics

---

## 🏗️ Tech Stack

### Frontend

* HTML, CSS, JavaScript
* Dynamic UI rendering
* Fetch API for backend communication

### Backend

* Node.js
* Express.js
* REST API architecture

### Database

* Neo4j (Graph Database)
* Cypher query language

---

## 🔥 Key Features

* 🎯 Personality-based house assignment
* 🧠 Graph-based data modeling (Neo4j)
* 📊 Real-time leaderboard with house statistics
* 🔗 Relationship mapping between students and houses
* ⚡ RESTful API integration
* 🌐 Fully deployable architecture (Frontend + Backend + Cloud DB)

---

## 📊 Graph Data Model

* **Student → SORTED_INTO → House**
* **House → HAS_TRAIT → Trait**

This structure allows:

* Efficient querying
* Relationship-based insights
* Scalable data modeling

---

## 📡 API Endpoints

| Method | Endpoint     | Description             |
| ------ | ------------ | ----------------------- |
| POST   | /api/sort    | Save quiz result        |
| GET    | /api/results | Fetch all students      |
| GET    | /api/stats   | House-wise distribution |
| GET    | /api/houses  | Houses with traits      |

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/sorting-hat.git
cd sorting-hat
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
NEO4J_URI=your_neo4j_uri
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
PORT=3000
```

### 3. Seed Database

```bash
node seed.js
```

### 4. Start Server

```bash
node server.js
```

### 5. Run Frontend

Open `index.html` in browser

---

## 🧪 Example Cypher Query

```cypher
MATCH (s:Student)-[:SORTED_INTO]->(h:House)
RETURN h.name, count(s) AS total
ORDER BY total DESC
```

---

## 💡 Future Enhancements

* User authentication (login/signup)
* Recommendation system (similar users)
* Advanced analytics dashboard
* Mobile-responsive UI improvements

---

## 📌 Why This Project Stands Out

* Uses **graph database instead of traditional SQL**
* Demonstrates **real-world backend + API integration**
* Shows understanding of **data relationships and modeling**
* Fully deployable and scalable architecture

---

## 👩‍💻 Author

Nishtha Jaiswal
(Full-stack developer | Creative technologist)

---
