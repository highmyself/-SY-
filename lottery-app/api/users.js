// api/users.js
const { db } = require('./firebase.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());

    const masked = users.map(u => ({
      nickname: u.nickname[0] + '*'.repeat(u.nickname.length - 2) + u.nickname.slice(-1),
      uid: u.uid[0] + '*'.repeat(u.uid.length - 2) + u.uid.slice(-1),
    }));

    res.json(masked);
  } catch (error) {
    res.status(500).json({ error: '获取用户失败' });
  }
};