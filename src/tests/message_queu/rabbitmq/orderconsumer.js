"use strict";

const amqp = require("amqplib");

async function consunmerOrderedMessage() {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    if (!connection) {
      throw new Error("Error connecting to RabbitMQ");
    }
    const channel = await connection.createChannel();
    const queuName = "orderred-queued-message";
    await channel.assertQueue(queuName, { durable: true });

    channel.prefetch(1); //  don't dispatch a new message to a worker until it has processed and acknowledged the previous one.

    channel.consume(queuName, (msg) => {
      const message = JSON.parse(msg.content.toString());

      setTimeout(() => {
        console.log("Message ordered:", message);
        channel.ack(msg);
      }, Math.random() * 10000);
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
  }
}

consunmerOrderedMessage()
  .then((rs) => console.log("rs", rs))
  .catch((err) => console.log("err", err));
