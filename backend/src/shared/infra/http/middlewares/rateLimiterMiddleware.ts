import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

import cacheConfig from '@config/cache';

import AppError from '@shared/errors/AppError';

const redisClient = new Redis(cacheConfig.config.redis);

const maxRatePerSecondByIP = 10;
const maxBlockPerMinuteByIP = 5;
const maxBlockPerHourByIP = 50;
const maxBlockPerDayByIP = 500;

const limiterRatePerSecondByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'limiter:rate-per-second-by-ip',
  points: maxRatePerSecondByIP,
  duration: 1,
  blockDuration: 1, // Block for 1 second, if max rate per second
});

const limiterBlockPerMinuteByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'limiter:block-per-minute-by-ip',
  points: maxBlockPerMinuteByIP,
  duration: 60,
  blockDuration: 60, // Block for 1 minute, if max block per minute
});

const limiterBlockPerHourByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'limiter:block-per-hour-by-ip',
  points: maxBlockPerHourByIP,
  duration: 60 * 60,
  blockDuration: 60 * 60, // Block for 1 hour, if max block per hour
});

const limiterBlockPerDayByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'limiter:block-per-day-by-ip',
  points: maxBlockPerDayByIP,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24, // Block for 1 day, if max block per day
});

export default async function rateLimiterMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { ip } = request;

  const [
    resRatePerSecondByIP,
    resBlockPerMinuteByIP,
    resBlockPerHourByIP,
    resBlockPerDayByIP,
  ] = await Promise.all([
    limiterRatePerSecondByIP.get(ip),
    limiterBlockPerMinuteByIP.get(ip),
    limiterBlockPerHourByIP.get(ip),
    limiterBlockPerDayByIP.get(ip),
  ]);

  let retrySecs = 0;

  // Check if IP is already blocked
  if (
    resBlockPerDayByIP !== null &&
    resBlockPerDayByIP.consumedPoints > maxBlockPerDayByIP
  ) {
    retrySecs = Math.round(resBlockPerDayByIP.msBeforeNext / 1000) || 1;
  } else if (
    resBlockPerHourByIP !== null &&
    resBlockPerHourByIP.consumedPoints > maxBlockPerHourByIP
  ) {
    retrySecs = Math.round(resBlockPerHourByIP.msBeforeNext / 1000) || 1;
  } else if (
    resBlockPerMinuteByIP !== null &&
    resBlockPerMinuteByIP.consumedPoints > maxBlockPerMinuteByIP
  ) {
    retrySecs = Math.round(resBlockPerMinuteByIP.msBeforeNext / 1000) || 1;
  } else if (
    resRatePerSecondByIP !== null &&
    resRatePerSecondByIP.consumedPoints > maxRatePerSecondByIP
  ) {
    retrySecs = Math.round(resRatePerSecondByIP.msBeforeNext / 1000) || 1;
  }

  if (retrySecs > 0) {
    response.set('Retry-After', String(retrySecs));
    throw new AppError('Too many requests', 429);
  } else {
    try {
      await limiterRatePerSecondByIP.consume(ip);
    } catch (err) {
      if (!(err instanceof Error)) {
        limiterBlockPerMinuteByIP.consume(ip);
        limiterBlockPerHourByIP.consume(ip);
        limiterBlockPerDayByIP.consume(ip);

        response.set(
          'Retry-After',
          String(Math.round(err.msBeforeNext / 1000) || 1),
        );
        throw new AppError('Too many requests', 429);
      }
    }
  }

  return next();
}
