const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const LOCK_MS = 15 * 60 * 1000;

export async function loginStatus(db, ip) {
  const now = Date.now();
  const row = await db.prepare(
    'SELECT failures, window_start, locked_until FROM login_attempts WHERE ip = ?',
  ).bind(ip).first();
  if (row && Number(row.locked_until) > now) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((Number(row.locked_until) - now) / 1000)),
    };
  }
  return { allowed: true, now };
}

export async function recordLoginFailure(db, ip) {
  const now = Date.now();
  const row = await db.prepare(
    'SELECT failures, window_start FROM login_attempts WHERE ip = ?',
  ).bind(ip).first();

  let failures = 1;
  let windowStart = now;
  if (row && now - Number(row.window_start) < WINDOW_MS) {
    failures = Number(row.failures) + 1;
    windowStart = Number(row.window_start);
  }
  const lockedUntil = failures >= MAX_FAILURES ? now + LOCK_MS : 0;

  await db.prepare(`
    INSERT INTO login_attempts (ip, failures, window_start, locked_until)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(ip) DO UPDATE SET
      failures = excluded.failures,
      window_start = excluded.window_start,
      locked_until = excluded.locked_until
  `).bind(ip, failures, windowStart, lockedUntil).run();

  const delayMs = Math.min(failures, 8) * 400;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return { failures, lockedUntil };
}

export async function clearLoginFailures(db, ip) {
  await db.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();
}
