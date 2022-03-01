const { run } = require('../dist/index');

describe('run', () => {
  it('returns status code 200', async () => {
    const { execute, stop } = run();

    const request1 = execute({
      lambdaPath: __dirname + '/handler/do-request.js'
    });

    const request2 = execute({
      lambdaPath: __dirname + '/handler/do-request.js'
    });

    const [result1, result2] = await Promise.all([request1, request2]);

    stop();

    expect(result1).toBe(200);
    expect(result2).toBe(200);
  });

  it('uses the lambdHandler option correctly', async () => {
    const { execute, stop } = run();

    const result = await execute({
      lambdaPath: __dirname + '/handler/non-default.js',
      lambdaHandler: 'go'
    });

    stop();

    expect(result).toBe('here');
  });

  it('passes the environment variables', async () => {
    const { execute, stop } = run();

    const result = await execute({
      lambdaPath: __dirname + '/handler/use-env.js',
      environment: {
        TEST: 'test'
      }
    });

    stop();

    expect(result).toBe('test');
  });

  it('respects the lambda timeout', async () => {
    const { execute, stop } = run();

    await expect(async () => {
      await execute({
        lambdaPath: __dirname + '/handler/timeout.js',
        lambdaTimeout: 2000
      });
    }).rejects.toStrictEqual({ error: 'lambda timeout' });

    stop();
  });
});
