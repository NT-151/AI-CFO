import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

const router = Router();

// User registration
router.post("/register", async (req: Request, res: Response) => {
  console.log("Registration endpoint called");
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);

  try {
    // Validate input data
    console.log("Validating input data...");
    const validatedData = insertUserSchema.parse(req.body);
    console.log("Validation successful:", validatedData);

    // Check if user already exists
    const existingUser = await storage.getUserByUsername(
      validatedData.username
    );
    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
        message: "A user with this username already exists",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      saltRounds
    );

    // Create user with hashed password
    const newUser = await storage.createUser({
      ...validatedData,
      password: hashedPassword,
    });

    // Don't send password back
    const { password, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Request body:", req.body);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof Error) {
      res.status(400).json({
        error: "Validation error",
        message: error.message,
        details: error.stack,
      });
    } else {
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to create user",
      });
    }
  }
});

// User login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        message: "Username and password are required",
      });
    }

    // Find user by username
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Username or password is incorrect",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Username or password is incorrect",
      });
    }

    // Debug: Check if session exists
    console.log("Before setting session - req.session:", req.session);
    console.log("req.session exists:", !!req.session);
    console.log("Session ID:", req.sessionID);

    // Set user session
    req.session.userId = user.id;

    // Debug: Check if session was set
    console.log("After setting session - req.session:", req.session);
    console.log("Session userId set to:", req.session.userId);
    console.log("New Session ID:", req.sessionID);

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to authenticate user",
    });
  }
});

// Add a debug endpoint to check session
router.get("/debug-session", (req: Request, res: Response) => {
  console.log("Debug session endpoint called");
  console.log("req.session:", req.session);
  console.log("req.sessionID:", req.sessionID);
  console.log("req.session.userId:", req.session.userId);

  res.json({
    session: req.session,
    sessionID: req.sessionID,
    userId: req.session.userId,
    cookies: req.headers.cookie,
  });
});

// User logout
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({
        error: "Logout failed",
        message: "Failed to destroy session",
      });
    }

    res.json({
      success: true,
      message: "Logout successful",
    });
  });
});

// Get current user
router.get("/me", async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        error: "Not authenticated",
        message: "No active session found",
      });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User no longer exists",
      });
    }

    // Don't send password back
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to get user information",
    });
  }
});

export default router;
