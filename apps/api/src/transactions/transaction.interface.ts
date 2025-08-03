export interface RateLimiter {
  canMakeRequest(): boolean;
  recordRequest(): void;
}
