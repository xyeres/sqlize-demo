const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'movies.db',
    logging: false,
    // global options
    define: {
        freezeTableName: true,
        timestamps: false,
    },
});

const db = {
    sequelize,
    Sequelize,
    models: {},
};

db.models.Movie = require('../models/movie')(sequelize);

module.exports = db;
