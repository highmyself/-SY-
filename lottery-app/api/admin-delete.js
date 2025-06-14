// api/admin-delete.js
import { db } from './firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password, uid } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: '密码错误' });
  }

  const snapshot = await db.collection('users').where('uid', '==', uid).get();

  const batch = db.batch();
  snapshot.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  res.json({ success: true });
}