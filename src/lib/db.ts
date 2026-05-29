import mysql from "mysql2/promise";

function parseDatabaseUrl(databaseUrl: string) {
  const u = new URL(databaseUrl);
  const database = u.pathname.replace(/^\//, "");
  if (!database) {
    throw new Error("DATABASE_URL must include a database name in the path");
  }
  return {
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database,
  };
}

const globalForDb = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

export function getPool(): mysql.Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalForDb.mysqlPool) {
    const cfg = parseDatabaseUrl(url);
    globalForDb.mysqlPool = mysql.createPool({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return globalForDb.mysqlPool;
}
