import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ICacheService } from '@domain/ports/interface/cache-service.interface';

@Injectable()
export class CacheManagerAdapter implements ICacheService {
  private readonly logger = new Logger(CacheManagerAdapter.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      this.logger.debug(`pegando no cache: metodo get do cache-manager chave=${key}`);
      const value = await this.cacheManager.get<T>(key);
      this.logger.debug(` metodo cache-manager valor=${JSON.stringify(value).substring(0, 100)}...`);
      return value === null ? undefined : value;
    } catch (error) {
      this.handleError('get', error as Error, key);
      return undefined;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      this.logger.debug(`Armazenando no cache: chave=${key}, valor=${JSON.stringify(value).substring(0, 100)}...`);
      // Garantir que sempre temos um TTL, usando 300 segundos como padrão se não for fornecido
      await this.cacheManager.set(key, value, { ttl: ttl || 300 });
      this.logger.debug(`Dados armazenados com sucesso no cache: chave=${key}`);
    } catch (error) {
      this.handleError('set', error as Error, key);
    }
  }

  async reset(): Promise<void> {
    try {
      await this.resetCacheStore();
    } catch (error) {
      this.handleError('reset', error as Error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.handleError('del', error as Error, key);
    }
  }

  private async resetCacheStore(): Promise<void> {
    try {
      if (typeof this.cacheManager.reset === 'function') {
        await this.cacheManager.reset();
        this.logger.log('Cache resetado com sucesso usando método reset direto');
        return;
      }

      const cacheStore = this.cacheManager as unknown as { store?: unknown };
      
      if (!cacheStore.store) {
        await this.cacheManager.del('*');
        this.logger.log('Cache resetado com sucesso usando método del com wildcard');
        return;
      }
      
      const resetMethods = ['reset', 'clear', 'flushAll'] as const;
      
      for (const method of resetMethods) {
        const store = cacheStore.store as Record<string, unknown>;
        if (typeof store[method] === 'function') {
          await (store[method] as () => Promise<void>)();
          this.logger.log(`Cache resetado com sucesso usando método: ${method}`);
          return;
        }
      }
      
      this.logger.warn('Nenhum método de reset de cache disponível no store atual');
    } catch (error) {
      this.logger.error(`Erro ao resetar cache: ${(error as Error).message}`, (error as Error).stack);
    }
  }


  private handleError(operation: string, error: Error, key?: string): void {
    const keyInfo = key ? ` para chave: ${key}` : '';
    this.logger.error(
      `Erro na operação de cache '${operation}'${keyInfo}: ${error.message}`, 
      error.stack
    );
  }
}