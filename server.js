// server.js (ES modules)
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static(__dirname + "/public"));

// parse form data
app.use(express.urlencoded({ extended: true }));

// serve static files (index.html, register.html, script.js, style.css)
app.use(express.static(__dirname));

// === Routes ===
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.get("/register", (req, res) => res.sendFile(__dirname + "/register.html"));

// === Registration Handler ===
app.post("/register", (req, res) => {
  const { username, email, password, confirmPassword } = req.body || {};

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).send("⚠️ Missing fields!");
  }

  if (password !== confirmPassword) {
    return res.status(400).send("❌ Passwords do not match!");
  }

  const user = { username, email, password };
  let users = [];

  try {
    if (fs.existsSync("users.json")) {
      users = JSON.parse(fs.readFileSync("users.json", "utf8"));
    }
  } catch (err) {
    console.error("Error reading users.json:", err);
  }

  users.push(user);
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  // Redirect back to home page
  return res.redirect("/");
});

// === Start Server ===
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
