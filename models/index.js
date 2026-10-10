const sequelize = require('../config/database');
const Teacher = require('./Teacher');
const Course = require('./Course');

// Связь One-to-Many: один преподаватель — много курсов
Teacher.hasMany(Course, {
    foreignKey: 'teacherId',
    as: 'courses'
});

Course.belongsTo(Teacher, {
    foreignKey: 'teacherId',
    as: 'teacher'
});

module.exports = {
    sequelize,
    Teacher,
    Course
};
