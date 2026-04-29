/**
 * Raw snapshot persistence (`raw_snapshots`) and outbound calls to the paid
 * provider via `ProviderClientService`. Imported by `ProxyModule`, `IngestionModule`,
 * and registry modules that need HTTP access to sportsdata365.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { RawSnapshot } from '../../shared/entities/raw-snapshot.entity';
import { SnapshotService } from './snapshot.service';
import { ProviderClientService } from './provider-client.service';
import { AlertService } from './alert.service';
import { SofaScoreValidatorService } from './sofascore-validator.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([RawSnapshot]),
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 3,
    }),
  ],
  providers: [
    SnapshotService,
    ProviderClientService,
    AlertService,
    SofaScoreValidatorService,
  ],
  exports: [
    SnapshotService,
    ProviderClientService,
    AlertService,
    SofaScoreValidatorService,
  ],
})
export class SnapshotModule {}
