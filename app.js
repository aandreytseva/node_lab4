require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize, Teacher, Course } = require('./models');
const logger = require('./middleware/logger');
const courseRoutes = require('./routes/courseRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const courseController = require('./controllers/courseController');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger);

// Routes
app.get('/', (req, res) => res.redirect('/courses'));
app.use('/courses', courseRoutes);
app.use('/teachers', teacherRoutes);
app.get('/statistics', courseController.statistics);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { url: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).render('error', { error: err });
});

// Database connection and server start
async function start() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established');

        await sequelize.sync();
        console.log('Models synchronized');

        // Seed initial data if tables are empty
        const teacherCount = await Teacher.count();
        if (teacherCount === 0) {
            await Teacher.bulkCreate([
                { name: 'Ivan Ivanov', email: 'ivanov@example.com', department: 'Informatics', academicDegree: 'Doctor' },
                { name: 'Maria Petrova', email: 'petrova@example.com', department: 'Mathematics', academicDegree: 'Candidate' },
                { name: 'Alexei Sidorov', email: 'sidorov@example.com', department: 'Physics', academicDegree: 'Professor' },
                { name: 'Elena Kozlova', email: 'kozlova@example.com', department: 'Informatics', academicDegree: 'Candidate' }
            ]);
            console.log('Initial teachers created');

            await Course.bulkCreate([
                { title: 'Web Development', credits: 5, semester: 3, description: 'Fundamentals of web development with HTML, CSS, JavaScript', teacherId: 1 },
                { title: 'Database Systems', credits: 4, semester: 4, description: 'Relational databases, SQL, normalization', teacherId: 1 },
                { title: 'Linear Algebra', credits: 3, semester: 1, description: 'Vectors, matrices, linear transformations', teacherId: 2 },
                { title: 'Mathematical Analysis', credits: 5, semester: 1, description: 'Limits, derivatives, integrals', teacherId: 2 },
                { title: 'Quantum Mechanics', credits: 4, semester: 5, description: 'Introduction to quantum physics', teacherId: 3 },
                { title: 'Node.js Development', credits: 4, semester: 5, description: 'Server-side JavaScript with Node.js and Express', teacherId: 4 }
            ]);
            console.log('Initial courses created');
        }

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start the application:', error.message);
        process.exit(1);
    }
}

start();
