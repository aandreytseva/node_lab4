const { Op } = require('sequelize');
const { Course, Teacher } = require('../models');

// Список курсов с поиском и фильтрацией
exports.index = async (req, res) => {
    try {
        const { search, teacherId, semester } = req.query;
        const where = {};

        if (search) {
            where.title = { [Op.iLike]: `%${search}%` };
        }
        if (teacherId) {
            where.teacherId = teacherId;
        }
        if (semester) {
            where.semester = semester;
        }

        const courses = await Course.findAll({
            where,
            include: { model: Teacher, as: 'teacher' },
            order: [['title', 'ASC']]
        });

        const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });

        res.render('courses/index', {
            courses,
            teachers,
            search: search || '',
            selectedTeacherId: teacherId || '',
            selectedSemester: semester || ''
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).render('error', { error });
    }
};

// Форма добавления
exports.createForm = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
        res.render('courses/create', { errors: [], course: {}, teachers });
    } catch (error) {
        console.error('Error loading create form:', error);
        res.status(500).render('error', { error });
    }
};

// Сохранение курса
exports.create = async (req, res) => {
    try {
        const { title, credits, semester, description, teacherId } = req.body;

        const teacher = await Teacher.findByPk(teacherId);
        if (!teacher) {
            const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
            return res.render('courses/create', {
                errors: ['Выбранный преподаватель не существует'],
                course: req.body,
                teachers
            });
        }

        await Course.create({ title, credits: parseInt(credits), semester: parseInt(semester), description, teacherId });
        res.redirect('/courses');
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(e => e.message);
            const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
            res.render('courses/create', {
                errors,
                course: req.body,
                teachers
            });
        } else {
            console.error('Error creating course:', error);
            res.status(500).render('error', { error });
        }
    }
};

// Просмотр курса
exports.details = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: { model: Teacher, as: 'teacher' }
        });
        if (!course) {
            return res.status(404).render('404', { url: req.originalUrl });
        }
        res.render('courses/details', { course });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).render('error', { error });
    }
};

// Форма редактирования
exports.editForm = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).render('404', { url: req.originalUrl });
        }
        const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
        res.render('courses/edit', { course, teachers, errors: [] });
    } catch (error) {
        console.error('Error loading edit form:', error);
        res.status(500).render('error', { error });
    }
};

// Сохранение изменений
exports.update = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).render('404', { url: req.originalUrl });
        }

        const { title, credits, semester, description, teacherId } = req.body;

        const teacher = await Teacher.findByPk(teacherId);
        if (!teacher) {
            const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
            return res.render('courses/edit', {
                errors: ['Выбранный преподаватель не существует'],
                course: { ...req.body, id: req.params.id },
                teachers
            });
        }

        await course.update({
            title,
            credits: parseInt(credits),
            semester: parseInt(semester),
            description,
            teacherId
        });
        res.redirect(`/courses/${course.id}`);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(e => e.message);
            const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
            res.render('courses/edit', {
                errors,
                course: { ...req.body, id: req.params.id },
                teachers
            });
        } else {
            console.error('Error updating course:', error);
            res.status(500).render('error', { error });
        }
    }
};

// Удаление курса
exports.delete = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).render('404', { url: req.originalUrl });
        }
        await course.destroy();
        res.redirect('/courses');
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).render('error', { error });
    }
};

// Страница статистики
exports.statistics = async (req, res) => {
    try {
        const totalTeachers = await Teacher.count();
        const totalCourses = await Course.count();

        // Количество курсов в каждом семестре
        const semesterStats = await Course.findAll({
            attributes: [
                'semester',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
            ],
            group: ['semester'],
            order: [['semester', 'ASC']],
            raw: true
        });

        // Количество курсов у каждого преподавателя
        const teacherStats = await Teacher.findAll({
            include: {
                model: Course,
                as: 'courses',
                attributes: ['id']
            },
            order: [['name', 'ASC']]
        });

        // Преподаватель с наибольшим количеством курсов
        let topTeacher = null;
        let maxCourses = 0;
        teacherStats.forEach(t => {
            if (t.courses.length > maxCourses) {
                maxCourses = t.courses.length;
                topTeacher = t;
            }
        });

        res.render('statistics', {
            totalTeachers,
            totalCourses,
            semesterStats,
            teacherStats,
            topTeacher,
            maxCourses
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).render('error', { error });
    }
};
