// /Users/shinji81/my-app/backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database/db');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = 3001;

// CORS
const corsOptions = {
  origin: '*', // 모든 origin 허용 (개발 중에만 이렇게 설정하는 것이 좋습니다)
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); 

// 라우터
console.log('API 라우트 연결됨');
app.use('/api', imageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
