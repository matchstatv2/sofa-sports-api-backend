import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface MaxRetryAlertDetails {
  endpointUrl: string;
  totalAttempts: number;
  finalErrorMessage: string;
  timestampIso: string;
}

export interface SchemaMismatchIssue {
  field: string;
  message: string;
}

export interface SchemaMismatchAlertDetails {
  endpointUrl: string;
  issues: SchemaMismatchIssue[];
  receivedKeys: string[];
  missingKeys: string[];
  timestampIso: string;
}

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  private readonly dedupeWindowMs: number;
  private readonly recentAlertMap = new Map<string, number>();

  constructor(private readonly configService: ConfigService) {
    this.dedupeWindowMs =
      this.configService.get<number>("ALERT_DEDUP_WINDOW_MS") ?? 10 * 60 * 1000;
  }

  sendMaxRetryAlert(details: MaxRetryAlertDetails): void {
    const dedupeKey = [
      "max-retry",
      details.endpointUrl,
      details.totalAttempts.toString(),
      details.finalErrorMessage,
    ].join("|");

    if (!this.shouldSendAlert(dedupeKey)) {
      return;
    }

    // Alert email sending is intentionally disabled.
    this.logger.warn(
      `Alert email disabled: max-retry condition for ${details.endpointUrl}`,
    );
  }

  sendSchemaMismatchAlert(details: SchemaMismatchAlertDetails): void {
    const issueSignature = details.issues
      .map((issue) => `${issue.field}:${issue.message}`)
      .sort()
      .join(";");
    const dedupeKey = [
      "schema-mismatch",
      details.endpointUrl,
      issueSignature,
    ].join("|");

    if (!this.shouldSendAlert(dedupeKey)) {
      return;
    }

    // Alert email sending is intentionally disabled.
    this.logger.warn(
      `Alert email disabled: schema mismatch for ${details.endpointUrl}`,
    );
  }

  private shouldSendAlert(key: string): boolean {
    const now = Date.now();

    for (const [existingKey, sentAt] of this.recentAlertMap.entries()) {
      if (now - sentAt > this.dedupeWindowMs) {
        this.recentAlertMap.delete(existingKey);
      }
    }

    const existing = this.recentAlertMap.get(key);
    if (existing && now - existing <= this.dedupeWindowMs) {
      this.logger.debug(`Deduped alert key=${key}`);
      return false;
    }

    this.recentAlertMap.set(key, now);
    return true;
  }
}
