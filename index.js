const express =  require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const articleControllerClass = require('./controllers/article');
const articleController = new articleControllerClass();

const authorControllerClass = require('./controllers/author');
const authorController = new authorControllerClass();

const articleRoutes = require('./routers/articles');
app.use('/', articleRoutes);

const authorRoutes = require('./routers/authors');
app.use('/', authorRoutes);

// Start server
app.listen(3025, () => {
    console.log(`Server running on http://localhost:3025`);
});
