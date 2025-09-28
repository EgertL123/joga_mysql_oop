const express =  require('express');
const bodyParser = require('body-parser');
const sessions = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(sessions({
    secret: 'thisismysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

const articleControllerClass = require('./controllers/article');
const articleController = new articleControllerClass();

const authorControllerClass = require('./controllers/author');
const authorController = new authorControllerClass();

const articleRoutes = require('./routers/articles');
app.use('/', articleRoutes);
const authorRoutes = require('./routers/authors');
app.use('/', authorRoutes);

const userRoutes = require('./routers/users');
app.use('/', userRoutes);

// Start server
app.listen(3025, () => {
    console.log(`Server running on http://localhost:3025`);
});
