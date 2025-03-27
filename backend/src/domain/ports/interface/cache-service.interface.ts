export interface ICacheService {
  get<T>(key: string): Promise<T | undefined>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  reset(): Promise<void>;
  del(key: string): Promise<void>;
}