type Bucket = { count: number; resetAt: number };

const memory = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX = 8;

async function upstashLimit(ip: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return memoryLimit(ip);

  const key = `bookings:rl:${ip}`;
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["PEXPIRE", key, String(WINDOW_MS), "NX"],
    ]),
  });

  if (!res.ok) return memoryLimit(ip);

  const data = (await res.json()) as Array<{ result: number }>;
  const count = data?.[0]?.result ?? 0;
  return count <= MAX;
}

function memoryLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = memory.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    memory.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= MAX;
}

export async function allowBookingRequest(ip: string): Promise<boolean> {
  try {
    return await upstashLimit(ip);
  } catch {
    return memoryLimit(ip);
  }
}
