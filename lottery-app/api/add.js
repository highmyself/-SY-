// api/add.js
import { db } from './firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { nickname, uid } = req.body;
  if (!nickname || !uid) return res.status(400).json({ error: '缺少字段' });

  await db.collection('users').add({ nickname, uid });
  res.json({ success: true });
}