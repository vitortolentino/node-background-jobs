import fastify from "fastify";
import { EmailData } from "./providers/IMailProvider";
import { MailProvider } from "./providers/implementations/MailProvider";
import { SimpleQueueProcessMail } from "./lib/arrayQueue/SimpleQueueProcessMail";
import { FastifyAdapter } from "@bull-board/fastify";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { RedisQueue } from "./lib/redisQueue/RedisQueue";
import { emailQueue } from "./infra/redis";

export const app = fastify({ logger: true });

const serverAdapter = new FastifyAdapter();

createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter,
});

serverAdapter.setBasePath("/admin/queues");
app.register(serverAdapter.registerPlugin(), {
  prefix: "/admin/queues",
  basePath: "/",
});

app.post<{ Body: EmailData }>("/send-email", (request, reply) => {
  const { to, subject, text, html } = request.body;

  if (!to || !subject || (!text && !html)) {
    return reply.status(400).send({ error: "missing parameters" });
  }

  const mailProvider = new MailProvider();
  const queue = new RedisQueue(mailProvider, emailQueue);

  queue.add({ to, subject, text, html });

  queue.process({ maxRetries: 2 });

  reply.send({ message: "Email enqueued" });
});
