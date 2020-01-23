'use strict';

const PersonsController = require('../../interface_adapters/controllers/PersonsController');

module.exports = {
    name: 'persons',
    version: '1.0.0',
    register: async (server) => {

        server.route([           
            {
                method: 'POST',
                path: '/persons',
                handler: PersonsController.createPerson,
                options: {
                    description: 'Create a person',
                    tags: ['api'],
                },
            },  
                 
        ]);
    }
};