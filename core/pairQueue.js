const queues = {};

export function enqueue(pair, fn) {
  if (!queues[pair]) queues[pair] = Promise.resolve();

  queues[pair] = queues[pair].then(fn).catch(console.error);
}