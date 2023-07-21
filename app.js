const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// PostgreSQL 데이터베이스 연결 설정
const pool = new Pool({
  user: 'postgres', // 데이터베이스 사용자 이름
  host: 'localhost', // 데이터베이스 호스트
  database: 'HF', // 데이터베이스 이름
  password: '1234', // 데이터베이스 비밀번호
  port: 5432, // 데이터베이스 포트 
});

app.use(cors());
app.use(express.json());

// 사용자 조회
app.get('/api/users', (req, res) => {
  pool.query('SELECT * FROM users', (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(result.rows);
    }
  });
});

// 사용자 추가
app.post('/api/users', (req, res) => {
  const { fName, lName, passw1 } = req.body;
  pool.query(
    'INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3) RETURNING *',
    [fName, lName, passw1],
    (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(result.rows[0]);
      }
    }
  );
});

// 사용자 업데이트
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { fName, lName } = req.body;
  pool.query(
    'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3',
    [fName, lName, userId],
    (err) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// 사용자 삭제
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  pool.query('DELETE FROM users WHERE id = $1', [userId], (err) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
