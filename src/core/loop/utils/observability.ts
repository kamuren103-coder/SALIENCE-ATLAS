export class LoopTelemetry {
  private static metrics: Array<{ name: string; value: any; timestamp: string }> = [];

  static record(name: string, value: any): void {
    this.metrics.push({ name, value, timestamp: new Date().toISOString() });
    if (this.metrics.length > 500) {
      this.metrics.shift();
    }
  }

  static getMetrics(): Array<{ name: string; value: any; timestamp: string }> {
    return [...this.metrics];
  }
}
