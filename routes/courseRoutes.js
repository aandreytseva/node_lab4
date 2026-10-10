const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { validateCourse } = require('../middleware/validateData');

// GET /courses — список курсов
router.get('/', courseController.index);

// GET /courses/new — форма добавления
router.get('/new', courseController.createForm);

// POST /courses — сохранение курса
router.post('/', validateCourse, courseController.create);

// GET /courses/:id — информация о курсе
router.get('/:id', courseController.details);

// GET /courses/:id/edit — форма редактирования
router.get('/:id/edit', courseController.editForm);

// POST /courses/:id/edit — сохранение изменений
router.post('/:id/edit', validateCourse, courseController.update);

// POST /courses/:id/delete — удаление курса
router.post('/:id/delete', courseController.delete);

module.exports = router;
