// Jetons de session (utilisable dans le middleware Edge comme côté serveur)
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'portfolio_session';
export const SESSION_DAYS = 7;

function secretKey() {
  return new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-portfolio-secret-a-changer');
}

export async function signSession(admin) {
  return new SignJWT({ sub: String(admin.id), name: admin.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload;
  } catch {
    return null;
  }
}
