'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'harera',
          lastName: 'kalex',
          username: 'harera.kalex',
          email: 'hareraloston@gmail.com',
          password: bcrypt.hashSync('butare', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    ),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
