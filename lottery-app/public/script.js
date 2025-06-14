document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nickname = document.getElementById('nickname').value;
  const uid = document.getElementById('uid').value;
  await fetch('/api/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, uid })
  });
  alert('提交成功！');
});

async function loadMaskedUsers() {
  const res = await fetch('/api/users');
  const users = await res.json();
  const container = document.getElementById('masked-users');
  container.innerHTML = '<h3>参与用户（打码）</h3>' + users.map(u => `<div>${u.nickname} - ${u.uid}</div>`).join('');
}
loadMaskedUsers();

async function viewFull() {
  const password = document.getElementById('admin-password').value;
  const res = await fetch('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  if (!res.ok) return alert('密码错误');
  const users = await res.json();
  const container = document.getElementById('full-users');
  container.innerHTML = '<h3>完整用户列表</h3>' + users.map(u => `<div>${u.nickname} - ${u.uid} <button onclick="deleteUser('${u.uid}')">删除</button></div>`).join('');
}

async function deleteUser(uid) {
  const password = document.getElementById('admin-password').value;
  const res = await fetch('/api/admin/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, uid })
  });
  if (res.ok) {
    alert('已删除');
    viewFull();
    loadMaskedUsers();
  }
}