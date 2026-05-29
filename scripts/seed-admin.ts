import "dotenv/config";
import bcrypt from "bcryptjs";
import { getPool } from "../src/lib/db";

const EMAIL = "admin@mana.local";
const PASSWORD = "Admin123456";
const NAME = "مدیر سیستم";

async function main() {
  const pool = getPool();
  const passwordHash = bcrypt.hashSync(PASSWORD, 10);

  await pool.execute(
    `INSERT INTO admins (name, email, password, role)
     VALUES (?, ?, ?, 'ADMIN')
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password = VALUES(password),
       role = VALUES(role)`,
    [NAME, EMAIL, passwordHash],
  );

  console.log("Seed OK:", EMAIL);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
