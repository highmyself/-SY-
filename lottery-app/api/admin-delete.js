import { db } from './firebase.js';

export default async function handler(req, res) {
  // CORS 设置
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).end();

  const { password, uid } = req.body;
  if (password !== 'process.env.ADMIN_PASSWORD') return res.status(403).json({ error: '密码错误' });
  if (!uid) return res.status(400).json({ error: '缺少UID' });

  try {
    const snapshot = await db.collection('users').where('uid', '==', uid).get();
    if (snapshot.empty) return res.status(404).json({ error: '用户不存在' });

    snapshot.forEach(doc => doc.ref.delete());
    res.status(200).json({ message: '删除成功' });
  } catch (e) {
    res.status(500).json({ error: '删除失败' });
  }
}