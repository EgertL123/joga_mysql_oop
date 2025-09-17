const BaseSQLModel = require('./base');

class AuthorModel extends BaseSQLModel {
    constructor() {
        super('author');
    }

    async findAll(authorId) {
        const authors = await super.findMany('id', authorId);
        return authors;
    }

    async findOne(authorId) {
        const author = await super.findOne('id', authorId);
        return author;
    }
}

module.exports = AuthorModel;
