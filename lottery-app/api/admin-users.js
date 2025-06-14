// api/admin-users.js
import { db } from './firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: '密码错误' });
  }

  const snapshot = await db.collection('users').get();
  const users = snapshot.docs.map(doc => doc.data());

  res.json(users);
}