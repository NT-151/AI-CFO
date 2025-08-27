const express = require("express");
const app = express();

app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.post("/api/auth/register", (req, res) => {
  console.log("Registration request received:", req.body);
  res.json({ success: true, message: "Test registration endpoint working" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log(`Test endpoint: http://localhost:${port}/test`);
  console.log(
    `Registration endpoint: http://localhost:${port}/api/auth/register`
  );
});
