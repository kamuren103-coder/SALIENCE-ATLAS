import { LoopContext, LoopResult } from './types';

export interface IObserver {
  observe(targetId: string, context?: LoopContext): Promise<any>;
}

export interface IPlanner {
  plan(context: LoopContext, observation: any): Promise<any>;
}

export interface IExecutor {
  execute(context: LoopContext, plan: any): Promise<any>;
}

export interface IValidator {
  validate(context: LoopContext, executionResult: any): Promise<boolean>;
}

export interface IReflectionEngine {
  reflect(context: LoopContext, result: LoopResult): Promise<void>;
}
