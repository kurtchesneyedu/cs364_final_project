//file: server.js
 
const express = require("express");
const crypto = require('crypto');
const session = require("express-session");
const pool = require('./db');
const auth = require("./auth");
require("dotenv").config();

const app = express();
const saltRounds = 10;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false} // would be set to true if using HTTPS
  })
);

//timer
app.post("/save-timer", async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(403).json({ message: "Not logged in" });

  const { sport, team, athlete, event, elapsed } = req.body;

  const query = `
    INSERT INTO timer_results (username, sport, team, athlete, event, elapsed)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  const values = [user.username, sport, team, athlete, event, elapsed];

  try {
    await pool.query(query, values);
    res.json({ success: true, message: "Timer result saved" });
  } catch (err) {
    console.error("Error saving timer result:", err);
    res.status(500).json({ success: false, message: "Error saving timer" });
  }
});

// app.post("/register", auth.register);
app.post("/register", async (req, res) => {

  console.log("server.js: register ");
  const { username, email, password, role } = req.body;

  console.log(`server.js: register username: ${username}`);
  console.log(`server.js: register email: ${email}`);
  console.log(`server.js: register password: ${password}`);
  console.log(`server.js: register role: ${role}`);

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

  const query = 'INSERT INTO users (username, email, hash, salt, role) VALUES ($1, $2, $3, $4, $5) RETURNING id';

  const values = [username, email, hash, salt, role];
  console.log("trying query with these values...");
  console.log(values);

  try {
    const result = await pool.query(query, values);
    console.log("user NOW registered ... going to respond");
    console.log(result);
    res.json({ success: true, message: `${role} account created`, username: `${username}` }); 
  } catch (error) {
    console.log("in catch block of server.js/register");
    console.log(error);
    res.json({ success: false, message: 'Username or email already exists.' });
  }
});

app.post("/login", auth.login);

app.get("/users", auth.ensureAdmin, async (req, res) => {
  console.log("in GET /users");
  const result = await pool.query("SELECT username, email, role FROM users");
  console.log(`GET /users rows: ${result.rows}`);
  res.json(result.rows);
});

//timer
app.get("/timers", auth.ensureAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM timer_results ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching timer results:", err);
    res.status(500).json({ message: "Error fetching timers" });
  }
});

async function truncateTimers() {
  if (!confirm("Are you sure you want to delete ALL timer results?")) return;

  const response = await fetch("/api/timers", {
      method: "DELETE",
      credentials: "include"
  });

  const result = await response.json();
  if (result.success) {
      alert("Timer results cleared.");
      fetchTimers(); // refresh table
  } else {
      alert("Failed to clear timer results.");
  }
}



app.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

app.get("/session", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});


app.listen(3000, () => console.log("Server running on port 3000"));
