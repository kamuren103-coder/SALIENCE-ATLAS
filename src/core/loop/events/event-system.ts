export class LoopEventSystem {
  private static listeners: Map<string, Array<(data: any) => void>> = new Map();

  static async publish(eventName: string, targetId: string, execId: string, payload: any): Promise<void> {
    const callbacks = this.listeners.get(eventName) || [];
    const eventObj = { eventName, targetId, execId, payload, timestamp: new Date().toISOString() };
    callbacks.forEach(cb => {
      try {
        cb(eventObj);
      } catch (err) {
        console.error('[LoopEventSystem] Listener error:', err);
      }
    });
  }

  static subscribe(eventName: string, callback: (data: any) => void): () => void {
    const list = this.listeners.get(eventName) || [];
    list.push(callback);
    this.listeners.set(eventName, list);
    return () => {
      const idx = list.indexOf(callback);
      if (idx !== -1) list.splice(idx, 1);
    };
  }
}
