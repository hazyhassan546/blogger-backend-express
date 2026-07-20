import "dotenv/config";
import express from "express";
const userRoutes = require("./routes/users");
const blogRoutes = require("./routes/blogs");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Blog API running TS",
  });
});

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
