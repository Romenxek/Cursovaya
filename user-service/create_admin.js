const { sequelize } = require("./models/index.js");
const { User } = require('./models');
const bcrypt = require('bcrypt');
const { connectToRabbitMQ } = require('./rabbit.js');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection OK');

    const created = await User.findOne({
        where: {id: 1}
    });
    if (created) {
        await User.destroy({
            where: {id: 1}
        });
        console.log("Old admin user destroyed");
    }

    await User.create({
        id: 1,
        email: "admin@admin.admin",
    });
    try {
        const channel = await connectToRabbitMQ();
        channel.publish(
            "user.events.exchange",
            "user.deleted",
            Buffer.from(JSON.stringify({ userId: 1 }))
        );
        channel.publish(
            "user.events.exchange",
            "user.added",
            Buffer.from(JSON.stringify({ userId: 1 }))
        );

        // Закрываем channel и connection graceful
        // !!!!!!!!СУПЕР ВАЖНО!!!!!!!!
        await channel.close();
        await channel.connection.close();
        console.log('Admin created');
    }
    catch (error) {
        console.log(error);
    }
    process.exit(0);

  } catch (err) {
    console.error('ERROR:');
    console.error(err);
    process.exit(1);
  }
})();