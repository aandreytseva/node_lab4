const { Teacher, Course } = require('../models');

// Список преподавателей
exports.index = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({
            include: {
                model: Course,
                as: 'courses',
                attributes: ['id']
            },
            order: [['name', 'ASC']]
        });
        res.render('teachers/index', { teachers });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).render('error', { error });
    }
};

// Форма добавления
exports.createForm = (req, res) => {
    res.render('teachers/create', { errors: [], teacher: {} });
};

// Сохранение преподавателя
exports.create = async (req, res) => {
    try {
        const { name, email, department, academicDegree } = req.body;
        await Teacher.create({ name, email, department, academicDegree });
        res.redirect('/teachers');
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(e => e.message);
            res.render('teachers/create', {
                errors,
                teacher: req.body
            });
        } else {
            console.error('Error creating teacher:', error);
            res.status(500).render('error', { error });
        }
    }
};

// Просмотр преподавателя
exports.details = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id, {
            include: {
                model: Course,
                as: 'courses'
            }
        });
        if (!teacher) {
            return res.status(404).render('404', { url: req.originalUrl });
        }
        res.render('teachers/details', { teacher });
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).render('error', { error });
    }
};

// Форма редактирования
exports.editForm = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) {
            return res.status(404).render('404', { url: req.originalUrl });
        }
        res.render('teachers/edit', { teacher, errors: [] });
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).render('error', { error });
    }
};

// Сохранение изменений
exports.update = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) {
            return res.status(404).render('404', { url: req.originalUrl });
        }
        const { name, email, department, academicDegree } = req.body;
        await teacher.update({ name, email, department, academicDegree });
        res.redirect(`/teachers/${teacher.id}`);
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(e => e.message);
            res.render('teachers/edit', {
                errors,
                teacher: { ...req.body, id: req.params.id }
            });
        } else {
            console.error('Error updating teacher:', error);
            res.status(500).render('error', { error });
        }
    }
};

// Удаление преподавателя
exports.delete = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id, {
            include: { model: Course, as: 'courses' }
        });
        if (!teacher) {
            return res.status(404).render('404', { url: req.originalUrl });
        }
        if (teacher.courses && teacher.courses.length > 0) {
            const teachers = await Teacher.findAll({
                include: { model: Course, as: 'courses', attributes: ['id'] },
                order: [['name', 'ASC']]
            });
            return res.render('teachers/index', {
                teachers,
                deleteError: 'Невозможно удалить преподавателя, у которого есть курсы'
            });
        }
        await teacher.destroy();
        res.redirect('/teachers');
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).render('error', { error });
    }
};
