'use strict';

const Kafka = require('node-rdkafka');
const uuid = require('uuid');

module.exports = class KAFKA {
  constructor(app) {
    this.app = app;
    this.logger = app.logger;
    this.config = app.config.gymboKafka;
    this.consumerMap = new Map();
    this.producerMap = new Map();
    app.ready(() => {
      this.appReady = true;
    });
  }

  async init() {
    const { sub, pub } = this.config;
    for (const options of sub) {
      await this.createConsumer(options);
    }

    for (const options of pub) {
      await this.createProducer(options);
    }
  }

  async createConsumer(options) {
    const { app, consumerMap } = this;
    return new Promise(resolve => {
      const key = options.key;
      delete options.key;
      const consumer = new Kafka.KafkaConsumer(options);
      consumer.connect();
      consumer.on('ready', () => {
        this.logger.info(`[egg-gymbo-kafka] create key:${key} Consumer successfully`);
        resolve(true);
      });
      consumerMap.set(key, consumer);
      app.beforeClose(async function() {
        consumer.disconnect();
      });
    });
  }

  async createProducer(options) {
    const { app, producerMap } = this;
    return new Promise(resolve => {
      const reg = new RegExp('-', 'g');
      const uuidDate = uuid.v4()
        .replace(reg, '');
      const key = options.key;
      delete options.key;
      options[ 'client.id' ] = uuidDate;
      const producer = new Kafka.Producer(options);
      producer.setPollInterval(100);
      producer.connect();
      producer.on('ready', () => {
        this.logger.info(`[egg-gymbo-kafka] create key:${key} Producer successfully`);
        resolve(true);
      });
      producerMap.set(key, producer);
      app.beforeClose(async function() {
        producer.disconnect();
      });
    });
  }

  async produce(key, topic, msgs) {
    const failedMsgs = [];
    if (Array.isArray(msgs)) {
      for (const msg of msgs) {
        const result = await this.produceSingleMessage(key, topic, msg);
        if (!result) {
          failedMsgs.push(msg);
        }
      }
    } else {
      const result = await this.produceSingleMessage(key, topic, msgs);
      if (!result) {
        failedMsgs.push(msgs);
      }
    }
    return failedMsgs;
  }

  async produceSingleMessage(key, topic, msg) {
    return new Promise((resolve, reject) => {
      const producer = this.producerMap.get(key);
      producer.produce(
        topic,
        null,
        Buffer.from(JSON.stringify(msg)),
        null,
        Date.now()
      );
      producer.on('delivery-report', () => {
        resolve(true);
      });
      producer.on('error', error => {
        this.logger.error(`[egg-gymbo-kafka] error: ${error}`);
        reject(false);
      });
    });
  }
};
