import fs from 'fs';
import csvParser from 'csv-parser';
import xml2js from 'xml2js';
import { promisify } from 'util';
import {StatementRecord} from './interfaces/StatementRecord';
import {FailedRecord} from './interfaces/FailedRecord';

const readFile = promisify(fs.readFile);


class StatementProcessor {
    private records: StatementRecord[] = [];
    private failedRecords: FailedRecord[] = [];

    async readCSVFile(filePath: string): Promise<void> {
        const results: any[] = await new Promise((resolve, reject) => {
            const data: any[] = [];
            fs.createReadStream(filePath)
                .pipe(csvParser({
                    mapHeaders: ({ header }) => header.trim(),
                    mapValues: ({ value }) => value.trim()
                }))
                .on('data', (row) => data.push(row))
                .on('end', () => resolve(data))
                .on('error', (error) => reject(error));
        });

        this.records = this.records.concat(results.map((item) => ({
            transactionRef: item.Reference,
            accountNumber: item["Account Number"],
            startBalance: parseFloat(item["Start Balance"]),
            mutation: parseFloat(item.Mutation.startsWith('+') ? item.Mutation.substring(1) : item.Mutation),
            description: item.Description,
            endBalance: parseFloat(item["End Balance"]),
        })));
    }

    async readXMLFile(filePath: string): Promise<void> {
        const data = await readFile(filePath, { encoding: 'utf-8' });
        const result: any = await xml2js.parseStringPromise(data);

        const transactions = result.records.record.map((item: any) => ({
            transactionRef: item.$.reference,
            accountNumber: item.accountNumber[0],
            startBalance: parseFloat(item.startBalance[0]),
            mutation: parseFloat(item.mutation[0].startsWith('+') ? item.mutation[0].substring(1) : item.mutation[0]),
            description: item.description[0],
            endBalance: parseFloat(item.endBalance[0]),
        }));

        this.records = this.records.concat(transactions);
    }

    validateRecords(): void {
        const uniqueRefs = new Set<string>();

        this.records.forEach(record => {
            let failureReasons: string[] = []; // Track multiple failure reasons for a single record

            if (uniqueRefs.has(record.transactionRef)) {
                failureReasons.push('Duplicate transaction reference');
            } else {
                uniqueRefs.add(record.transactionRef);
            }

            const calculatedEndBalance = record.startBalance + record.mutation;
            if (Math.abs(calculatedEndBalance - record.endBalance) > 0.001) {
                failureReasons.push('End balance does not match calculated value');
            }

            if (failureReasons.length > 0) {
                this.failedRecords.push({
                    record,
                    failureReason: failureReasons.join('; ')
                });
            }
        });
    }

    getFailedRecords(): FailedRecord[] {
        return this.failedRecords;
    }

    getRecords(): StatementRecord[] {
        return this.records;
    }
}

export default StatementProcessor;
