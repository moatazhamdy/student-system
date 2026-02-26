const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// File paths - OUTSIDE src folder to avoid Angular hot reload
const DB_PATH = path.join(__dirname, 'database');
const STUDENTS_FILE = path.join(DB_PATH, 'students.json');
const INSTRUCTORS_FILE = path.join(DB_PATH, 'instructors.json');
const COURSES_FILE = path.join(DB_PATH, 'courses.json');
const USERS_FILE = path.join(DB_PATH, 'users.json');

// Helper function to read JSON file
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

// Helper function to write JSON file
const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// Authentication Routes

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const usersData = readJSONFile(USERS_FILE);
  if (!usersData || !usersData.users) {
    return res.status(500).json({ error: 'Failed to read users database' });
  }

  const user = usersData.users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate JWT token (expires in 8 hours)
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  // Return user info without password
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    token,
    user: userWithoutPassword
  });
});

// Logout (client-side token removal, but endpoint for consistency)
app.post('/api/auth/logout', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
app.get('/api/auth/me', verifyToken, (req, res) => {
  const usersData = readJSONFile(USERS_FILE);
  const user = usersData?.users?.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Protected API Routes

// Get all students
app.get('/api/students', verifyToken, (req, res) => {
  const data = readJSONFile(STUDENTS_FILE);
  res.json(data || { students: [] });
});

// Get student by ID
app.get('/api/students/:id', verifyToken, (req, res) => {
  const data = readJSONFile(STUDENTS_FILE);
  const student = data?.students?.find(s => s.id == req.params.id);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Create student
app.post('/api/students', verifyToken, (req, res) => {
  const data = readJSONFile(STUDENTS_FILE) || { students: [] };
  const newStudent = {
    ...req.body,
    id: Math.max(0, ...data.students.map(s => s.id || 0)) + 1
  };
  data.students.push(newStudent);
  const success = writeJSONFile(STUDENTS_FILE, data);
  if (success) {
    res.json(newStudent);
  } else {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student
app.put('/api/students/:id', verifyToken, (req, res) => {
  const data = readJSONFile(STUDENTS_FILE);
  const index = data?.students?.findIndex(s => s.id == req.params.id);
  if (index !== -1 && index !== undefined) {
    data.students[index] = { ...data.students[index], ...req.body, id: parseInt(req.params.id) };
    const success = writeJSONFile(STUDENTS_FILE, data);
    if (success) {
      res.json(data.students[index]);
    } else {
      res.status(500).json({ error: 'Failed to update student' });
    }
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Delete student
app.delete('/api/students/:id', verifyToken, (req, res) => {
  const data = readJSONFile(STUDENTS_FILE);
  const index = data?.students?.findIndex(s => s.id == req.params.id);
  if (index !== -1 && index !== undefined) {
    data.students.splice(index, 1);
    const success = writeJSONFile(STUDENTS_FILE, data);
    if (success) {
      res.json({ success: true, message: 'Student deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete student' });
    }
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

// Get all instructors
app.get('/api/instructors', verifyToken, (req, res) => {
  const data = readJSONFile(INSTRUCTORS_FILE);
  res.json(data || { instructors: [] });
});

// Get instructor by ID
app.get('/api/instructors/:id', verifyToken, (req, res) => {
  const data = readJSONFile(INSTRUCTORS_FILE);
  const instructor = data?.instructors?.find(i => i.id == req.params.id);
  if (instructor) {
    res.json(instructor);
  } else {
    res.status(404).json({ error: 'Instructor not found' });
  }
});

// Create instructor
app.post('/api/instructors', verifyToken, (req, res) => {
  const data = readJSONFile(INSTRUCTORS_FILE) || { instructors: [] };
  const newInstructor = {
    ...req.body,
    id: Math.max(0, ...data.instructors.map(i => i.id || 0)) + 1
  };
  data.instructors.push(newInstructor);
  const success = writeJSONFile(INSTRUCTORS_FILE, data);
  if (success) {
    res.json(newInstructor);
  } else {
    res.status(500).json({ error: 'Failed to create instructor' });
  }
});

// Update instructor
app.put('/api/instructors/:id', verifyToken, (req, res) => {
  const data = readJSONFile(INSTRUCTORS_FILE);
  const index = data?.instructors?.findIndex(i => i.id == req.params.id);
  if (index !== -1 && index !== undefined) {
    data.instructors[index] = { ...data.instructors[index], ...req.body, id: parseInt(req.params.id) };
    const success = writeJSONFile(INSTRUCTORS_FILE, data);
    if (success) {
      res.json(data.instructors[index]);
    } else {
      res.status(500).json({ error: 'Failed to update instructor' });
    }
  } else {
    res.status(404).json({ error: 'Instructor not found' });
  }
});

// Delete instructor
app.delete('/api/instructors/:id', verifyToken, (req, res) => {
  const data = readJSONFile(INSTRUCTORS_FILE);
  const index = data?.instructors?.findIndex(i => i.id == req.params.id);
  if (index !== -1 && index !== undefined) {
    data.instructors.splice(index, 1);
    const success = writeJSONFile(INSTRUCTORS_FILE, data);
    if (success) {
      res.json({ success: true, message: 'Instructor deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete instructor' });
    }
  } else {
    res.status(404).json({ error: 'Instructor not found' });
  }
});

// Get all courses
app.get('/api/courses', verifyToken, (req, res) => {
  const data = readJSONFile(COURSES_FILE);
  res.json(data || { courses: [] });
});

// Get course by ID
app.get('/api/courses/:id', verifyToken, (req, res) => {
  const data = readJSONFile(COURSES_FILE);
  const course = data?.courses?.find(c => c.id == req.params.id);
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

// Create course
app.post('/api/courses', verifyToken, (req, res) => {
  const data = readJSONFile(COURSES_FILE) || { courses: [] };
  const newCourse = {
    ...req.body,
    id: Math.max(0, ...data.courses.map(c => c.id || 0)) + 1
  };
  data.courses.push(newCourse);
  const success = writeJSONFile(COURSES_FILE, data);
  if (success) {
    res.json(newCourse);
  } else {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course
app.put('/api/courses/:id', verifyToken, (req, res) => {
  const data = readJSONFile(COURSES_FILE);
  const index = data?.courses?.findIndex(c => c.id == req.params.id);
  if (index !== -1 && index !== undefined) {
    data.courses[index] = { ...data.courses[index], ...req.body, id: parseInt(req.params.id) };
    const success = writeJSONFile(COURSES_FILE, data);
    if (success) {
      res.json(data.courses[index]);
    } else {
      res.status(500).json({ error: 'Failed to update course' });
    }
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

// Delete course
app.delete('/api/courses/:id', verifyToken, (req, res) => {
  const data = readJSONFile(COURSES_FILE);
  const index = data?.courses?.findIndex(c => c.id == req.params.id);
  if (index !== -1 && index !== undefined) {
    data.courses.splice(index, 1);
    const success = writeJSONFile(COURSES_FILE, data);
    if (success) {
      res.json({ success: true, message: 'Course deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete course' });
    }
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Database API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Database API server running on http://localhost:${PORT}`);
  console.log(`📁 Database files location: ${DB_PATH}\n`);
});
