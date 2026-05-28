// import pkg from './models/index.js';
// const { sequelize } = pkg;

// await sequelize.query("ALTER TABLE users AUTO_INCREMENT = 1");
// await sequelize.query("ALTER TABLE routes AUTO_INCREMENT = 1");

const { Route, User, sequelize } = require('./models');

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection OK');

//     const user = await User.create({
//         email: "test@asd"
//     });
//     const route = await Route.create({
//         created_by_id: 1
//     });

//     console.log('New user saved:');
//     //console.log(user.toJSON());
//     console.log(route.toJSON()); 

//     process.exit(0);

//   } catch (err) {
//     console.error('ERROR:');
//     console.error(err);
//     process.exit(1);
//   }
// })();

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection OK');

    await User.destroy({
        where: {id: 1}
     });

    console.log('user destroyed:');
    //console.log(user.toJSON());

    process.exit(0);

  } catch (err) {
    console.error('ERROR:');
    console.error(err);
    process.exit(1);
  }
})();