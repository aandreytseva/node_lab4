# Лабораторная работа №4 — CRUD-приложение с PostgreSQL и Sequelize

## Информация о студенте
- **Студент:** Andreiteva Anastasia
- **Группа:** IAFR-2302
- **Дисциплина:** Node.js

## Цель работы
Научиться подключать приложение Node.js к базе данных PostgreSQL, создавать модели с помощью Sequelize, устанавливать связи между моделями и выполнять операции создания, просмотра, редактирования и удаления данных.

## Описание
Система управления учебными курсами — веб-приложение на Express.js с PostgreSQL. Продолжение лабораторной работы №3: данные из массивов перенесены в базу данных.

## Используемые технологии
- Node.js
- Express.js
- PostgreSQL
- Sequelize (ORM)
- EJS (шаблонизатор)
- dotenv (переменные окружения)
- Архитектура MVC

## Структура проекта
```
lab4/
├── app.js                    — Главный файл приложения
├── package.json
├── .env                      — Переменные окружения (не в Git)
├── .gitignore
├── config/
│   └── database.js           — Подключение к PostgreSQL
├── models/
│   ├── index.js              — Связи между моделями
│   ├── Teacher.js            — Модель преподавателя
│   └── Course.js             — Модель курса
├── controllers/
│   ├── teacherController.js  — Логика преподавателей
│   └── courseController.js   — Логика курсов и статистика
├── routes/
│   ├── teacherRoutes.js      — Маршруты преподавателей
│   └── courseRoutes.js       — Маршруты курсов
├── middleware/
│   ├── logger.js             — Логирование запросов
│   └── validateData.js       — Валидация данных
├── views/
│   ├── courses/              — Шаблоны курсов (index, details, create, edit)
│   ├── teachers/             — Шаблоны преподавателей (index, details, create, edit)
│   ├── partials/             — Общие части (header, footer)
│   ├── statistics.ejs        — Страница статистики
│   ├── 404.ejs               — Страница 404
│   └── error.ejs             — Страница ошибки
└── public/
    └── css/
        └── style.css         — Стили приложения
```

## Модели данных

### Teacher (Преподаватель)
| Поле           | Тип     | Требования               |
|----------------|---------|--------------------------|
| id             | INTEGER | Primary key, auto increment |
| name           | STRING  | Обязательное             |
| email          | STRING  | Обязательное, уникальное |
| department     | STRING  | Обязательное             |
| academicDegree | STRING  | Обязательное             |

### Course (Курс)
| Поле        | Тип     | Требования               |
|-------------|---------|--------------------------|
| id          | INTEGER | Primary key, auto increment |
| title       | STRING  | Обязательное             |
| credits     | INTEGER | Положительное число      |
| semester    | INTEGER | От 1 до 8               |
| description | TEXT    | Обязательное             |
| teacherId   | INTEGER | Foreign key → Teacher    |

### Связь
**Teacher 1 → Many Courses** — один преподаватель ведёт несколько курсов.

## Маршруты

### Преподаватели (/teachers)
| Метод | URL                  | Назначение             |
|-------|----------------------|------------------------|
| GET   | /teachers            | Список преподавателей  |
| GET   | /teachers/new        | Форма добавления       |
| POST  | /teachers            | Сохранение             |
| GET   | /teachers/:id        | Просмотр               |
| GET   | /teachers/:id/edit   | Форма редактирования   |
| POST  | /teachers/:id/edit   | Обновление             |
| POST  | /teachers/:id/delete | Удаление               |

### Курсы (/courses)
| Метод | URL                 | Назначение            |
|-------|---------------------|-----------------------|
| GET   | /courses            | Список курсов         |
| GET   | /courses/new        | Форма добавления      |
| POST  | /courses            | Сохранение            |
| GET   | /courses/:id        | Просмотр              |
| GET   | /courses/:id/edit   | Форма редактирования  |
| POST  | /courses/:id/edit   | Обновление            |
| POST  | /courses/:id/delete | Удаление              |

### Статистика
| Метод | URL         | Назначение        |
|-------|-------------|-------------------|
| GET   | /statistics | Страница статистики |

## Функциональность
- CRUD-операции для преподавателей и курсов
- Связь One-to-Many между Teacher и Course
- Поиск курсов по названию
- Фильтрация по преподавателю и семестру
- Комбинированная фильтрация
- Валидация данных (middleware + Sequelize)
- Защита от удаления преподавателя с курсами
- Подтверждение удаления курса
- Страница статистики
- Обработка ошибок (try/catch, async/await)
- Логирование запросов

## Установка и запуск

1. Создайте базу данных PostgreSQL:
```sql
CREATE DATABASE node_courses;
```

2. Настройте `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=node_courses
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
```

3. Установите зависимости:
```bash
npm install
```

4. Запустите приложение:
```bash
npm start
```

5. Откройте в браузере: http://localhost:3000

## Выводы
В данной лабораторной работе было реализовано полноценное CRUD-приложение с использованием PostgreSQL и Sequelize ORM. Данные из массивов лабораторной работы №3 были перенесены в реляционную базу данных. Была настроена связь One-to-Many между моделями Teacher и Course, реализованы операции создания, чтения, обновления и удаления с валидацией данных и обработкой ошибок.
