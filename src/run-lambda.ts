/* eslint-disable no-console */

import type { Callback } from 'aws-lambda';
import type { LambdaOptions, WithEvent, WithRequestNumber } from './types.js';
import { isOption, isWithEvent, isWithRequestNumber } from './types.js';
import { LambdaContext } from './utils/context.js';
import { serializeError } from './utils/error.js';
import { getLambdaHandler } from './utils/get-lambda-handler.js';

type RawHandlerOptions = LambdaOptions & WithRequestNumber & WithEvent;

const isValidOption = (options: RawHandlerOptions): boolean =>
  isOption(options) && isWithRequestNumber(options) && isWithEvent(options);

const getOptions = (rawOptions: string): RawHandlerOptions => {
  const options = JSON.parse(rawOptions);

  if (!isValidOption(options)) {
    throw new Error('Unable to execute lambda handler, invalid options given.');
  }

  return options;
};

export const runLambda = (): void => {
  process.on('message', async (rawOptions: string) => {
    const options = getOptions(rawOptions);

    try {
      const handler = await getLambdaHandler(options);
      const context = new LambdaContext(options);

      const callback: Callback = (error, result): void => {
        if (!process.send) {
          console.error('process.send is undefined');

          return;
        }

        process.send({
          result: result ?? undefined,
          error: error ? serializeError(error) : undefined,
          requestNumber: options.requestNumber
        });
      };

      const resultPromise = handler(options.event, context, callback);

      if (!resultPromise || !resultPromise.then) {
        return;
      }

      if (!process.send) {
        console.error('process.send is undefined');

        return;
      }

      process.send({
        result: await resultPromise,
        requestNumber: options.requestNumber
      });
    } catch (error: unknown) {
      process.send?.({
        error: serializeError(
          error instanceof Error ? error : new Error(String(error))
        ),
        requestNumber: options.requestNumber
      });
    }
  });

  process.stdin.resume();
};

runLambda();
