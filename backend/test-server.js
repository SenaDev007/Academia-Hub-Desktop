const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes de test
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running!' });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API test endpoint working',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@test.com' && password === 'test123') {
    res.json({
      success: true,
      token: 'test-jwt-token',
      user: { id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User' }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/students', (req, res) => {
  res.json({
    success: true,
    students: [
      { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@school.com' },
      { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@school.com' }
    ]
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/api/test`);
});
