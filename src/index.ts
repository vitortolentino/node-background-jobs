import { app } from "./server";

const main = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("servidor up na porta 3000");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

main();
