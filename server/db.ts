import dotenv from "dotenv";
import knex from "knex";

dotenv.config();

// ================= KNEX CONFIG =================
export const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 10,
  },
});

// ================= DB CONNECTION TEST =================
export async function connectDB() {
  try {
    await db.raw("SELECT 1");
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.warn("⚠️ Database Connection Failed:", error instanceof Error ? error.message : error);
    console.warn("⚠️ Server will run without database. Configure DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME to enable database features.");
  }
}
