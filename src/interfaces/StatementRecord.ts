export interface StatementRecord {
    transactionRef: string;
    accountNumber: string;
    startBalance: number;
    mutation: number;
    description: string;
    endBalance: number;
}
