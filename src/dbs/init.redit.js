"use strict";

const redis = require("redis");
const { RedisErrorResponse } = require("../core/error.response");

let client = {
    url: process.env.REDIS_URL,
  },
  statusConnectRedis = {
    CONNECT: " connect",
    END: " end",
    RECONNECT: " reconnecting",
    ERROR: " error",
  },
  connectionTimeout = null;
const REDIS_CONNECT_TIMEOUT = 10000,
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
      vn: "Kết nối với redis thất bại",
      en: "Connect to redis failed",
    },
  };
const handleTimeoutError = (timeout, message) => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse({
      message: REDIS_CONNECT_MESSAGE.vn,
      code: REDIS_CONNECT_MESSAGE.code,
    });
  }, REDIS_CONNECT_TIMEOUT);
};
const handleEventConnection = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("Redis connected");
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log("Redis end");
    // connect retry
    handleTimeoutError();
  });
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log("Redis reconnecting");
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.ERROR, () => {
    console.log("Redis error");
    handleTimeoutError();
  });
};
const initRedis = () => {
  const instanceRedis = redis.createClient();
  client.instanceConnect = instanceRedis;
  handleEventConnection({ connectionRedis: instanceRedis });
};

const getRedisClient = () => client;

const closeRedis = () => {
  client.instanceConnect.quit();
  client.instanceConnect = null;
};

module.exports = {
  initRedis,
  getRedisClient,
  closeRedis,
};
// docker run --name rdb -d -p 6379:6379 redis
//docker exec -it rdb redis-cli
