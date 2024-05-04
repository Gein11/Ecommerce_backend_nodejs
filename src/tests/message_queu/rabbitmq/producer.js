const amqp = require("amqplib");

const message = "hello, GOlang consume";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();
    const queue = "test-topic";
    await channel.assertQueue(queue); // Don't specify 'durable' property
    channel.sendToQueue(queue, Buffer.from(message));
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};
runProducer().catch(console.error);
