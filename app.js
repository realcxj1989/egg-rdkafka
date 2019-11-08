'use strict';

const KAFKA = require('./lib/kafka');

module.exports = app => {
  app.kafka = new KAFKA(app);
  app.beforeStart(async () => {
    await app.kafka.init();
  });
};
