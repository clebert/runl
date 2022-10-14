import type { LambdaOptions } from '../types.js';

const isDebugArg = (arg: string): boolean =>
  arg.startsWith('inspect') || arg.startsWith('--inspect');

const isDebugEnabled = (): boolean => process.execArgv.some(isDebugArg);

export const createExecArgv = (options: LambdaOptions): string[] =>
  isDebugEnabled() && options.debugPort
    ? process.execArgv.map((arg) =>
        isDebugArg(arg) ? `--inspect=${options.debugPort}` : arg
      )
    : process.execArgv;
