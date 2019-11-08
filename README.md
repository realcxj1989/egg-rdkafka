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

## Example
### Producer
```js
    public async kafkaProducer() {
        const { ctx, app } = this;
        const content: any = [];
        for (let i = 0; i < 10; i++) {
            content.push(`world{i}`);
        }
        const key = 'test';
        const topicName = 'hello'
        const failedMsgs = await app.kafka.produce(key, topicName, content);
        if (failedMsgs && failedMsgs.length > 0) {
            ctx.body = 'failed';
        } else {
            ctx.body = 'ok';
        }
    }
```
### Consumer
```js
        const key = 'test';
        const topicNames = ['hello'];
        const consumer = app.kafka.consumerMap.get(key);
        consumer.subscribe(topicNames);
        let interval = setInterval(() => {
            consumer.consume(1);
        }, 1000);
        consumer.on('data', async (data) => {
            clearInterval(interval);
            console.log(data)
            switch (data.topic) {
                case:'hello':{
                    await consumer.commit();
                    interval = setInterval(() => {
                        consumer.consume(1);
                    }, 1000);
                }
                default:{
                    console.log('error')
                }
            }
        })
```

## Questions & Suggestions

Please open an issue [here](https://github.com/realcxj1989/egg-rdkafka/issues).

## License

[MIT](LICENSE)
