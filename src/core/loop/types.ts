export type LoopState =
  | 'IDLE'
  | 'OBSERVING'
  | 'PLANNING'
  | 'EXECUTING'
  | 'VALIDATING'
  | 'REFLECTING'
  | 'COMPLETED'
  | 'FAILED';

export interface LoopContext {
  id: string;
  targetId: string;
  state: LoopState;
  startTime: number;
  metadata?: Record<string, any>;
  findings?: any[];
}

export interface LoopResult {
  success: boolean;
  state: LoopState;
  targetId: string;
  error?: string;
  durationMs?: number;
  data?: any;
}
