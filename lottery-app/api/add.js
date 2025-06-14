const { db } = require('./firebase.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { nickname, uid } = req.body;
  if (!nickname || !uid) return res.status(400).json({ error: '缺少参数' });

  try {
    await db.collection('users').add({ nickname, uid });
    res.status(200).json({ message: '添加成功' });
  } catch (e) {
    res.status(500).json({ error: '添加失败' });
  }
};