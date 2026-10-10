// Валидация данных преподавателя
exports.validateTeacher = (req, res, next) => {
    const { name, email, department, academicDegree } = req.body;
    const errors = [];

    if (!name || !name.trim()) {
        errors.push('Имя обязательно для заполнения');
    }
    if (!email || !email.trim()) {
        errors.push('Email обязателен для заполнения');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Некорректный формат email');
        }
    }
    if (!department || !department.trim()) {
        errors.push('Кафедра обязательна для заполнения');
    }
    if (!academicDegree || !academicDegree.trim()) {
        errors.push('Учёная степень обязательна для заполнения');
    }

    if (errors.length > 0) {
        return res.render(
            req.params.id ? 'teachers/edit' : 'teachers/create',
            { errors, teacher: { ...req.body, id: req.params.id } }
        );
    }
    next();
};

// Валидация данных курса
exports.validateCourse = async (req, res, next) => {
    const { title, credits, semester, description, teacherId } = req.body;
    const errors = [];

    if (!title || !title.trim()) {
        errors.push('Название курса обязательно для заполнения');
    }

    const creditsNum = parseInt(credits);
    if (!credits || isNaN(creditsNum) || creditsNum < 1) {
        errors.push('Кредиты должны быть положительным числом');
    }

    const semesterNum = parseInt(semester);
    if (!semester || isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
        errors.push('Семестр должен быть от 1 до 8');
    }

    if (!description || !description.trim()) {
        errors.push('Описание обязательно для заполнения');
    }

    if (!teacherId) {
        errors.push('Необходимо выбрать преподавателя');
    }

    if (errors.length > 0) {
        const { Teacher } = require('../models');
        const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
        return res.render(
            req.params.id ? 'courses/edit' : 'courses/create',
            { errors, course: { ...req.body, id: req.params.id }, teachers }
        );
    }
    next();
};
