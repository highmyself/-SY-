document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nickname = document.getElementById('nickname').value.trim();
  const uid = document.getElementById('uid').value.trim();
  if (!nickname || !uid) {
    alert('请填写昵称和UID');
    return;
  }
  try {
    const res = await fetch('/api/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, uid })
    });
    if (!res.ok) throw new Error('提交失败');
    alert('提交成功！');
    loadMaskedUsers(); // 提交成功后刷新参与用户列表
  } catch (err) {
    alert('提交失败，请稍后重试');
  }
});

async function loadMaskedUsers() {
  try {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('获取用户失败');
    const users = await res.json();
    const container = document.getElementById('masked-users');
    container.innerHTML = '<h3>参与用户（打码）</h3>' + users.map(u => `<div>${u.nickname} - ${u.uid}</div>`).join('');
  } catch {
    document.getElementById('masked-users').innerHTML = '获取用户失败，请刷新页面';
  }
}
loadMaskedUsers();

async function viewFull() {
  const password = document.getElementById('admin-password').value.trim();
  if (!password) {
    alert('请输入管理员密码');
    return;
  }
  try {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (!res.ok) {
      alert('密码错误');
      return;
    }
    const users = await res.json();
    const container = document.getElementById('full-users');
    container.innerHTML = '<h3>完整用户列表</h3>' + users.map(u => 
      `<div>${u.nickname} - ${u.uid} <button onclick="deleteUser('${u.uid}')">删除</button></div>`).join('');
  } catch {
    alert('请求失败，请稍后重试');
  }
}

async function deleteUser(uid) {
  const password = document.getElementById('admin-password').value.trim();
  if (!password) {
    alert('请输入管理员密码');
    return;
  }
  try {
    const res = await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, uid })
    });
    if (res.ok) {
      alert('已删除');
      viewFull();
      loadMaskedUsers();
    } else {
      alert('删除失败');
    }
  } catch {
    alert('请求失败，请稍后重试');
  }
}