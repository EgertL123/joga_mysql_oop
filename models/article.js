const BaseSQLModel = require('./base');

class ArticleModel extends BaseSQLModel {
    constructor() {
        super('article');
    }

    async findAll() {
    const articles = await super.findAll();
    return articles;
    }

    async findOne(slug) {
        const article = await super.findOne('slug', slug);
        return article;
    }

    async findMany(author) {
        const articles = await super.findMany('author_id', author.id);
        return articles;
    }

    async create(article) {
        const createdArticleId = await super.create(article);
        return createdArticleId;
    }

    async update(id, articleData) {
        const existingArticle = await this.findById(id);
        if (!existingArticle) {
            throw new Error(`Article with ID ${id} not found.`);
        }

        // Merge the new data with the existing fields
        const sanitizedUpdate = Object.fromEntries(
            Object.entries(articleData).filter(([_, value]) => value !== null && value !== undefined)
        );
        const mergedData = { ...existingArticle, ...sanitizedUpdate };

        // Call the base update method only with the updated fields
        const affectedRows = await super.update(id, sanitizedUpdate);
        return affectedRows;
    }

    async delete(id) {
        const deletedArticle = await super.delete(id);
        return deletedArticle;
    }
}

module.exports = ArticleModel;