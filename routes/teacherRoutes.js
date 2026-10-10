const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { validateTeacher } = require('../middleware/validateData');

// GET /teachers — список преподавателей
router.get('/', teacherController.index);

// GET /teachers/new — форма добавления
router.get('/new', teacherController.createForm);

// POST /teachers — сохранение преподавателя
router.post('/', validateTeacher, teacherController.create);

// GET /teachers/:id — информация о преподавателе
router.get('/:id', teacherController.details);

// GET /teachers/:id/edit — форма редактирования
router.get('/:id/edit', teacherController.editForm);

// POST /teachers/:id/edit — сохранение изменений
router.post('/:id/edit', validateTeacher, teacherController.update);

// POST /teachers/:id/delete — удаление преподавателя
router.post('/:id/delete', teacherController.delete);

module.exports = router;
