export default class LocalStorageMock {
  private store: Record<string, string | null> = {};
  public getItem(key: string) {
    return this.store[key] ?? null;
  }
  public setItem(key: string, payload: string) {
    this.store[key] = payload;
  }
  public removeItem(key: string) {
    this.store[key] = null;
  }
  public clear() {
    this.store = {};
  }
}
