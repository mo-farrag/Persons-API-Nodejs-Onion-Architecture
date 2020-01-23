'use strict';

const db = require('../../frameworks_drivers/database/models');

module.exports = class {
  constructor() {

  }

  getByCode(code) {
    return db.country.findOne({ where: { code: code } });
  }
}