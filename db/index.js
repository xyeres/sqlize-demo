const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/movies.db',
    logging: true,
    // global options
    define: {
        freezeTableName: false,
        timestamps: true,
    },
});

const db = {
    sequelize,
    Sequelize,
    models: {},
};

db.models.Movie = require('../models/movie')(sequelize);
db.models.Person = require('../models/person')(sequelize);

module.exports = db;
