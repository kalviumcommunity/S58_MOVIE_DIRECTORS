const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { startDatabase, stopDatabase, isConnected } = require("./db");
const DirectorModel = require("./director");
const UserModel = require("./User");
const { generateAccessToken, authenticateToken } = require("./auth");
const config = require("./config");

const app = express();
const port = process.env.PUBLIC_PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    let user = await UserModel.findOne({ username });

    if (!user) {
      user = await UserModel.create({ username, password });
      console.log(`New user created: ${username}`);
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).send("Invalid credentials");
      }
    }

    const accessToken = generateAccessToken(user);

    res.cookie("access_token", accessToken, {
      maxAge: config.accessTokenExpiry,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: `Logged in as ${username}`,
      user: {
        username: user.username,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/logout", async (req, res) => {
  try {
    console.log("Cookies received: ", req.cookies);

    const { access_token } = req.cookies;

    if (!access_token) {
      console.log("No access_token cookie found");
      return res.status(400).json({ error: "No access_token cookie found" });
    }

    console.log("Access token found");

    res.clearCookie("access_token");
    console.log("Access token cookie cleared");

    const decodedToken = jwt.decode(access_token);
    const { username } = decodedToken;

    if (!username) {
      console.log("No username found in token");
      return res.status(400).json({ error: "No username found in token" });
    }

    console.log("Username from token: ", username);

    const user = await UserModel.findOneAndDelete({ username });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User deleted successfully");

    res.status(200).send("Logged out and user deleted successfully");
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/data", authenticateToken, async (req, res) => {
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

app.post("/createData", authenticateToken, async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { error } = DirectorModel.schema.methods.joiValidate(req.body);
    if (error) {
      console.error("Validation error:", error.details);
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message),
      });
    }

    const directorData = { ...req.body, created_by: req.user._id };
    const director = await DirectorModel.create(directorData);
    res.json({ success: true, director });
  } catch (error) {
    console.error("Error creating director:", error);
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
