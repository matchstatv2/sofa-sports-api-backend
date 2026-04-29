/** Terminus health checks + HTTP probe to the configured provider health URL. */
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { SimpleHealthController } from './simple-health.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController, SimpleHealthController],
})
export class HealthModule {}
