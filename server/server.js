import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// AI generator route (dummy example)
app.post("/api/generate", (req, res) => {
  const { prompt } = req.body;
  // Yahan tum Stability AI ya apna generator call karoge
  res.json({ message: `Logo generated for: ${prompt}` });
});

app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
