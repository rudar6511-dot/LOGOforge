import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Example AI generator route
app.post("/api/generate", (req, res) => {
  const { prompt } = req.body;
  res.json({ message: `Logo generated for: ${prompt}` });
});

app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
