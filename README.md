# egg-rdkafka


<!--
Description here.
-->

## Install

```bash
$ npm i egg-rdkafka --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.rdkafka = {
  enable: true,
  package: 'egg-rdkafka',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
// Apache kafka
exports.rdkafka = {
    sub: [
        {
            'key': 'test1',
            'metadata.broker.list': 'xxx.xxx.xxx.xxx:9092',
            'group.id': 'test',
            'enable.auto.commit': false,
        },
        {
            'key': 'test2',
            'metadata.broker.list': 'xxx.xxx.xxx.xxx:9092',
            'group.id': 'test2',
            'enable.auto.commit': false,
        },
    ],
    pub: [
        {
            'key': 'test1',
            'metadata.broker.list': 'xxx.xxx.xxx.xxx:9092',
            'dr_cb': true,
        },
    ],
};
// 阿里云 kafka
exports.rdkafka = {
    sub: [
        {
            'key': 'ali1',
            'api.version.request': true,
            'bootstrap.servers': 'bootstrap_servers',
            'security.protocol': 'sasl_ssl',
            'ssl.ca.location': path.join(__dirname, './ca-cert'),
            'sasl.mechanisms': 'PLAIN',
            'enable.auto.commit': false,
            'sasl.username': 'sasl_plain_username',
            'sasl.password': 'sasl_plain_password',
            'group.id': 'consumer_id'
        }
    ],
    pub: [
        {
            'key': 'test1',
            'api.version.request': true,
            'bootstrap.servers': 'bootstrap_servers',
            'dr_cb': true,
            'dr_msg_cb': true,
            'security.protocol': 'sasl_ssl',
            'ssl.ca.location': path.join(__dirname, './ca-cert'),
            'sasl.mechanisms': 'PLAIN',
            'sasl.username': 'sasl_plain_username',
            'sasl.password': 'sasl_plain_password'
        },
    ],
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
