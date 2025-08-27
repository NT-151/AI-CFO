import session from "express-session";
import PgSession from "connect-pg-simple";
import { client } from "./services/supabase";

const PgSessionStore = PgSession(session);

export function setupSessions(app: any) {
  console.log("Setting up sessions...");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log("SESSION_SECRET exists:", !!process.env.SESSION_SECRET);
  console.log("FORCE_HTTPS:", process.env.FORCE_HTTPS);

  // Check if we have database connection
  if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
    console.log("Using PostgreSQL session store");
    // Use PostgreSQL session store in production
    app.use(
      session({
        store: new PgSessionStore({
          conObject: { connectionString: process.env.DATABASE_URL },
        }),
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure:
            process.env.NODE_ENV === "production" &&
            process.env.FORCE_HTTPS !== "false",
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          sameSite: "lax", // Add this for better compatibility
        },
        name: "sessionId", // Add explicit session name
      })
    );
  } else {
    console.log("Using memory session store");
    // Use memory store in development
    app.use(
      session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          sameSite: "lax",
        },
        name: "sessionId",
      })
    );
  }

  console.log("Sessions setup complete");
}
