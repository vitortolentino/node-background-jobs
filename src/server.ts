import fastify from 'fastify';
import { EmailData } from './providers/IMailProvider';
import { MailProvider } from './providers/implementations/MailProvider';
import { RedisQueue } from './lib/redisQueue/RedisQueue';
import { emailQueue } from './infra/redis';
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { FastifyAdapter } = require('@bull-board/fastify');

export const app = fastify({ logger: true });

const serverAdapter = new FastifyAdapter();
createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter,
});

serverAdapter.setBasePath('/admin/queues');
app.register(serverAdapter.registerPlugin(), { prefix: '/admin/queues' });

const mailProvider = new MailProvider();
const queue = new RedisQueue(mailProvider, emailQueue);

queue.process({ maxRetries: 3 });

app.post<{ Body: EmailData }>('/send-email', async (request, reply) => {
  const { to, subject, text, html } = request.body;

  if (!to || !subject || !text) {
    return reply.status(400).send({ error: 'Missing required fields' });
  }  

  queue.add({ to, subject, text, html });

  reply.send({ message: 'Email enqueued' });
});

