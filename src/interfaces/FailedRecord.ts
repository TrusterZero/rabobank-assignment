import { StatementRecord } from "./StatementRecord";

export interface FailedRecord {
    record: StatementRecord;
    failureReason: string;
}
