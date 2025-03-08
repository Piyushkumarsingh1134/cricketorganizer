import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secretKey = 'your_secret_key';

export function hashedPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: object) {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}
