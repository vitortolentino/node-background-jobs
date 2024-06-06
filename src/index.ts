import { app } from "./server";

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    app.log.info(`Server running at http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
