// DB config
const db = require('./db');
const { Op } = db.Sequelize;
// Import Models
const { Movie, Person } = db.models;


(async () => {
  // Force sync will drop all existing tables and create new records
  // on each run
  await db.sequelize.sync({ force: true });

  try {

    /* 
          C  R  U  D      O  P  E  R  A  T  I  O  N  S 
    */

    /* CREATE */
    // Example of saving some model instances
    const movie = await Movie.create({
      title: 'Toy Story',
      runtime: 81,
      releaseDate: '1995-11-22',
      isAvailableOnVHS: true,
    });
    console.log(movie.toJSON());

    const movie2 = await Movie.create({
      title: 'Star Wars',
      runtime: 115,
      releaseDate: '1977-04-14',
      isAvailableOnVHS: true,
    });

    const person = await Person.create({
      firstName: 'Mark',
      lastName: 'Hammil'
    })

    const person2 = await Person.create({
      firstName: 'Mark',
      lastName: 'Cuban'
    })
    const person3 = await Person.create({
      firstName: 'Maggie',
      lastName: 'Hampton'
    })
    // example of build method with save()
    const movie3 = await Movie.build({
      title: "Return of the Jedi",
      runtime: 143,
      releaseDate: '1984-05-04',
      isAvailableOnVHS: true,
    })
    await movie3.save(); // save the record



    /* READ */

    // Find by ID
    const movieById = await Movie.findByPk(2);
    // Find first matching options object params
    const movieByRuntime = await Movie.findOne({
      where: {
        runtime: 143
      }
    });
    // Find All Instances of a Model
    const allMovies = await Movie.findAll();
    // Find all with WHERE
    const markPersons = await Person.findAll({ where: { firstName: "Mark" } });
    // Returns array, so map through it and convert to JSON 
    // console.log(markPersons.map(p => p.toJSON()))

    /* 
      Attributes, Operators and Ordering 
    */

    // Attributes
    const moviesOnVHS = await Movie.findAll({
      attributes: ['id', 'title'], // return only id and title
      where: {
        isAvailableOnVHS: true,
      },
    });

    // Operators
    const moviesLte1990 = await Movie.findAll({
      where: {
        releaseDate: {
          // Greater than or equal operator
          [Op.lte]: '1990-01-01',
        },
        runtime: {
          // Between values
          [Op.between]: [75, 215]
        },
      },
      // Ordering
      order: [['title', 'DESC']] // TITLEs in descending order
    });

    // console.log(moviesLte1990.map(movie => movie.toJSON()));

    /* UPDATE */

    // Find instance to update
    let aMovie = await Movie.findByPk(2);
    // Change properties
    aMovie.isAvailableOnVHS = false;
    // Call save
    await aMovie.save();
    console.log(aMovie.get({ plain: true }))

    // Updating instance via .update()
    let anotherMovie = await Movie.findByPk(1);
    await anotherMovie.update({
      runtime: 434,
    });
    console.log(anotherMovie.get({ plain: true }))

    /*  
      The fields property sets which attributes are allowed to 
      be updated and saved to the database, using an array of 
      attribute (or column) names.
    */
      let yetAnotherMovie = await Movie.findByPk(1);
      await yetAnotherMovie.update({
        runtime: 464645,
        title: 'A Radical New Toy Story'
      },
      // Options obj inside update 
      {
        // Only these fields will be updated even though
        // we updated runtime above
        fields: ['title']
      });
      console.log(yetAnotherMovie.get({ plain: true }))

    /* DELETE */
      // Find a record
    const toyStory = await Movie.findByPk(1);

    // Delete a record
    await toyStory.destroy();

    // Find and log all movies
    const movies = await Movie.findAll();
    console.log( movies.map(movie => movie.toJSON()) );

  } catch (error) {
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      // Handle all other errors
      throw error;
    }
  }
})();