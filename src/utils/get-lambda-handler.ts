import type { Handler } from 'aws-lambda';
import type { LambdaOptions } from '../types.js';

class LambdaHandlerError extends Error {
  constructor(message: string, error: Error) {
    super(message);
    this.name = this.constructor.name;

    this.stack = this.stack + '\n' + error.stack;
  }
}

export const getLambdaHandler = async (
  options: LambdaOptions
): Promise<Handler> => {
  const lambdaHandler = options.lambdaHandler || 'handler';

  try {
    const lambdaFunction = await import(options.lambdaPath);

    if (!(lambdaHandler in lambdaFunction)) {
      throw new Error(`lambdaHandler ${lambdaHandler} is not exported!`);
    }

    return lambdaFunction[lambdaHandler] as Handler;
  } catch (error: unknown) {
    throw new LambdaHandlerError(
      `Unable to require lambda handler from ${options.lambdaPath}`,
      error instanceof Error ? error : new Error(String(error))
    );
  }
};
