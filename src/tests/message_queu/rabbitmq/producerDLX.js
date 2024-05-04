const amqp = require("amqplib");
const message = "Hello World!";
const log = console.log;
console.log = function () {
  log.apply(console, [new Date().toISOString(), ...arguments]);
};
const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    if (!connection) {
      throw new Error("Error connecting to RabbitMQ");
    }
    const channel = await connection.createChannel();

    const notificationExchange = "notificationExchange"; // notificationExchange is the exchange name
    const notiQueu = "notificationQueueProcess"; // assrtQueue is the queue name
    const notificationExchangeDLX = "notificationExchangeDLX"; //  direct exchange
    const notificationRoutingKeyDLX = "notificationRoutingKey"; // routingKey is the routing key and  DLX just receive message in case failed or Time To Live expired.

    //1. create Exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    }); // create direct exchange
    // direct truyền message từ producer đến consumer  chính xác nhất (đúng với routingKey của consumer)
    //2. create Queue
    const queueResult = await channel.assertQueue(notiQueu, {
      exclusive: false, // cho phep cac ket noi truy cap vao cung mot luc hang doi
      deadLetterExchange: notificationExchangeDLX, // if notiQueu is not consumed, it will be sent to the dead-letter exchange
      deadLetterRoutingKey: notificationRoutingKeyDLX, // dead-letter exchange will route the message to the dead-letter queue
    });
    // 3. Bind Queue
    await channel.bindQueue(queueResult.queue, notificationExchange); //notificationExchange don't have routing key beacause routingkey is queueResult.queue
    // notificationExchange will route to notiQueu and notificationExchangeDLX will route to notificationRoutingKeyDLX

    //4. send message to queue
    const msg = "A new product";
    console.log(`producer message:: ${msg}`);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000", // message will be expired after 10s
      persistent: true,
    });
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
  }
};
runProducer()
  .then((rs) => console.log("rs", rs))
  .catch((err) => console.log("err", err));
