'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert(
      'Games',
      [
        {
          name: 'sekiro',
          description:
            'Sekiro or Shadows Die Twice is a 2019 action-adventure game developed by FromSoftware and published by Activision',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'call of duty',
          description:
            'Call of Duty is a first-person shooter video game franchise published by Activision.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'world of warcraft',
          description:
            'World of Warcraft or Battle for Azeroth is the seventh expansion pack for the massively multiplayer online role-playing game World of Warcraft, following Legion.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'overwatch',
          description:
            'Overwatch is a 2016 team-based multiplayer first-person shooter game developed and published by Blizzard Entertainment.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    ),
  down: (queryInterface) => queryInterface.bulkDelete('Games', null, {}),
};
