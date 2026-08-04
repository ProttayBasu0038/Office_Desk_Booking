import redisclient from "../config/redis.js";

const LOCK_TTL = 120; // 2 minutes in seconds

// ─── Lock a seat ─────────────────────────────────────────────────────────────
export const lockSeat = async (seatId, date, slot, userId) => {
  try {
    if (slot === "full-day") {
      // full-day locks all three slots
      const keys = [
        `seat_lock:${seatId}:${date}:full-day`,
        `seat_lock:${seatId}:${date}:morning`,
        `seat_lock:${seatId}:${date}:afternoon`,
      ];

      // Check if any slot is locked by someone else
      for (const key of keys) {
        const owner = await redisclient.get(key);
        if (owner && owner !== userId) return false; // blocked
      }

      // Lock all three slots
      for (const key of keys) {
        await redisclient.set(key, userId, { ex: LOCK_TTL, nx: true });
      }
      return true;
    }

    // morning or afternoon
    // Check if full-day is already locked by someone else
    const fullDayKey = `seat_lock:${seatId}:${date}:full-day`;
    const fullDayOwner = await redisclient.get(fullDayKey);
    if (fullDayOwner && fullDayOwner !== userId) return false; // blocked by full-day

    // Lock the specific slot
    const key = `seat_lock:${seatId}:${date}:${slot}`;
    const result = await redisclient.set(key, userId, { ex: LOCK_TTL, nx: true });
    return result === "OK";
  } catch (err) {
    console.error("lockSeat error:", err.message);
    return false;
  }
};

// ─── Unlock a seat ───────────────────────────────────────────────────────────
export const unlockSeat = async (seatId, date, slot, userId) => {
  try {
    if (slot === "full-day") {
      const keys = [
        `seat_lock:${seatId}:${date}:full-day`,
        `seat_lock:${seatId}:${date}:morning`,
        `seat_lock:${seatId}:${date}:afternoon`,
      ];
      for (const key of keys) {
        const owner = await redisclient.get(key);
        if (owner === userId) await redisclient.del(key);
      }
      return true;
    }

    const key = `seat_lock:${seatId}:${date}:${slot}`;
    const owner = await redisclient.get(key);
    if (owner === userId) {
      await redisclient.del(key);
      return true;
    }
    return false;
  } catch (err) {
    console.error("unlockSeat error:", err.message);
    return false;
  }
};

// ─── Get lock owner ──────────────────────────────────────────────────────────
export const getLockOwner = async (seatId, date, slot) => {
  try {
    const key = `seat_lock:${seatId}:${date}:${slot}`;
    return await redisclient.get(key); // returns userId or null
  } catch (err) {
    console.error("getLockOwner error:", err.message);
    return null;
  }
};

// ─── Get lock TTL ────────────────────────────────────────────────────────────
export const getLockTTL = async (seatId, date, slot) => {
  try {
    const key = `seat_lock:${seatId}:${date}:${slot}`;
    return await redisclient.ttl(key); // returns seconds remaining
  } catch (err) {
    console.error("getLockTTL error:", err.message);
    return -1;
  }
};