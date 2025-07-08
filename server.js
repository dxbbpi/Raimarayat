const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.json'); // ใช้ path แบบ absolute

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('อ่านไฟล์ users.json ผิดพลาด:', error);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log('บันทึก users.json สำเร็จ:', users);
  } catch (error) {
    console.error('เขียนไฟล์ users.json ผิดพลาด:', error);
  }
}

// สมัครสมาชิก
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  console.log('สมัครสมาชิก:', username);

  if (!username || !password) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
  }

  const users = readUsers();
  const existing = users.find(u => u.username === username);
  if (existing) {
    return res.status(400).json({ error: 'มีชื่อผู้ใช้นี้อยู่แล้ว' });
  }

  users.push({ username, password });
  writeUsers(users);
  res.json({ message: 'สมัครสมาชิกสำเร็จ' });
});

// ล็อกอิน
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('ล็อกอิน:', username);

  if (!username || !password) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
  }

  const users = readUsers();
  const found = users.find(u => u.username === username && u.password === password);
  if (found) {
    return res.json({ success: true });
  }

  res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
