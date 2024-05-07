"use strict";
const amqp = require("amqplib");

async function producerOrderedMessage() {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    if (!connection) {
      throw new Error("Error connecting to RabbitMQ");
    }
    const channel = await connection.createChannel();
    const queuName = "orderred-queued-message";
    await channel.assertQueue(queuName, { durable: true });

    for (let i = 0; i < 10; i++) {
      const message = `Orderred message ${i}`;
      console.log(`producer message:: ${message}`);
      await channel.sendToQueue(
        queuName,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
        }
      );
    }

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
  }
}

producerOrderedMessage()
  .then((rs) => console.log("rs", rs))
  .catch((err) => console.log("err", err));
