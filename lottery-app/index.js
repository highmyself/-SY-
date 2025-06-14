const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const { adminPassword } = require('./config');

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

// 获取打码后的用户列表
app.get('/api/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const masked = users.map(u => ({
    nickname: u.nickname[0] + '*'.repeat(u.nickname.length - 2) + u.nickname.slice(-1),
    uid: u.uid[0] + '*'.repeat(u.uid.length - 2) + u.uid.slice(-1),
  }));
  res.json(masked);
});

// 管理员查看完整数据
app.post('/api/admin/users', (req, res) => {
  const { password } = req.body;
  if (password !== adminPassword) return res.status(403).json({ error: '密码错误' });
  const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  res.json(users);
});

// 添加新用户
app.post('/api/add', (req, res) => {
  const { nickname, uid } = req.body;
  if (!nickname || !uid) return res.status(400).json({ error: '缺少字段' });
  const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  users.push({ nickname, uid });
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

// 管理员删除用户
app.post('/api/admin/delete', (req, res) => {
  const { password, uid } = req.body;
  if (password !== adminPassword) return res.status(403).json({ error: '密码错误' });
  let users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  users = users.filter(u => u.uid !== uid);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

app.listen(3000, () => console.log('🎉 Server running on http://localhost:3000'));