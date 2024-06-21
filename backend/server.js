const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { startDatabase, stopDatabase, isConnected } = require("./db");
const DirectorModel = require("./director");
const UserModel = require("./User");

const app = express();
const port = process.env.PUBLIC_PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.post("/login", async (req, res) => {
  const { username } = req.body;

  try {
    if (!username) {
      return res.status(400).send("Username is required");
    }

    let user = await UserModel.findOne({ username });

    if (!user) {
      user = await UserModel.create({ username });
      console.log(`New user created: ${username}`);
    }

    res.cookie("username", username, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).send(`Logged in as ${username}`);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.status(200).send("Logged out successfully");
});

app.get("/data", async (req, res) => {
  try {
    if (!isConnected()) {
      throw new Error("Database is not connected");
    }
    const data = await DirectorModel.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/getUser/:id", async (req, res) => {
  try {
    const user = await DirectorModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/updateUser/:id", async (req, res) => {
  try {
    const { error } = DirectorModel.schema.methods.joiValidate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message),
      });
    }

    const user = await DirectorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const user = await DirectorModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/createData", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log request body for debugging
    const { error } = DirectorModel.schema.methods.joiValidate(req.body);
    if (error) {
      console.error("Validation error:", error.details); // Log validation error details
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message),
      });
    }

    const user = await DirectorModel.create(req.body);
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error creating user:", error); // Log any other errors
    res.status(500).json({ success: false, message: error.message });
  }
});

if (require.main === module) {
  startDatabase()
    .then(async () => {
      console.log("🚀 Server starting...");

      app.listen(port, () => {
        console.log(`🚀 Server running on PORT: ${port}`);
      });
    })
    .catch((err) => {
      console.error("Error starting server:", err.message);
      stopDatabase().finally(() => process.exit(1));
    });
}

module.exports = app;
