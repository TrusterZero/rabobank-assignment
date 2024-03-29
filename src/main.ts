import StatementProcessor from './StatementProcessor';

(async () => {
    const processor = new StatementProcessor();

    await processor.readCSVFile('records/records.csv');
    await processor.readXMLFile('records/records.xml');

    processor.validateRecords();
    const failedRecords = processor.getFailedRecords();

    if (failedRecords.length > 0) {
        console.log('Failed Records Report:');
        failedRecords.forEach(({ record, failureReason }) => {
            console.log(`Transaction Reference: ${record.transactionRef}, Description: ${record.description}, Failure Reason: ${failureReason}`);
        });
    } else {
        console.log('No failed records found.');
    }
})();
