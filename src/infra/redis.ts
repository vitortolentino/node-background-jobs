import Queue from "bull";

const redisConfig = {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
};

export const emailQueue = new Queue("email", redisConfig);
