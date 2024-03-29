import StatementProcessor from '../src/StatementProcessor';

describe('StatementProcessor', () => {
    let processor: StatementProcessor;

    beforeEach(() => {
        processor = new StatementProcessor();
    });

    describe('validateRecords', () => {
        it('should correctly identify and separate failed records with reasons', () => {
            processor['records'] = [
                { transactionRef: '1', accountNumber: 'NL93ABNA0585619023', startBalance: 100, mutation: 50, description: 'Deposit', endBalance: 150 },
                { transactionRef: '2', accountNumber: 'NL93ABNA0585619024', startBalance: 100, mutation: -50, description: 'Withdrawal', endBalance: 50 },
                { transactionRef: '1', accountNumber: 'NL93ABNA0585619025', startBalance: 200, mutation: 50, description: 'Duplicate Ref', endBalance: 250 },
                { transactionRef: '3', accountNumber: 'NL93ABNA0585619026', startBalance: 100, mutation: 50, description: 'Incorrect End Balance', endBalance: 200 },
            ];

            processor.validateRecords();

            const failedRecords = processor.getFailedRecords();

            expect(failedRecords).toHaveLength(2);
            expect(failedRecords.some(r => r.record.transactionRef === '1' && r.failureReason.includes('Duplicate transaction reference'))).toBeTruthy();
            expect(failedRecords.some(r => r.record.transactionRef === '3' && r.failureReason.includes('End balance does not match calculated value'))).toBeTruthy();
        });
    });
});
