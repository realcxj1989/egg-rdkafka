'use strict';

const mock = require('egg-mock');

describe('test/rdkafka.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/rdkafka-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, rdkafka')
      .expect(200);
  });
});
