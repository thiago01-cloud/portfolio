// Jetons de session (utilisable dans le middleware Edge comme côté serveur)
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'portfolio_session';
export const SESSION_DAYS = 7;

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    // En production, on refuse de signer ou d'accepter des sessions sans vrai secret
    if (process.env.NODE_ENV === 'production') return null;
    return new TextEncoder().encode('dev-portfolio-secret-a-changer-uniquement-en-local');
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(admin) {
  const key = secretKey();
  if (!key) throw new Error('AUTH_SECRET manquant ou trop court (32 caractères minimum).');
  return new SignJWT({ sub: String(admin.id), name: admin.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(key);
}

export async function verifySession(token) {
  const key = secretKey();
  if (!token || !key) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}
