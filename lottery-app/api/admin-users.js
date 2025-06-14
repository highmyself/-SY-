const { db } = require('./firebase.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;
  if (password !== '你的管理员密码') return res.status(403).json({ error: '密码错误' });

  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: '获取用户失败' });
  }
};