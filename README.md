# Rabobank Customer Statement Processor

## Overview

This project is a utility for processing customer statement records from Rabobank. It supports both CSV and XML formats
and performs validations to ensure the integrity of the transactions. The processor checks for unique transaction
references and validates the end balances of each record. It generates a report for any records that fail validations,
detailing the failure reasons.

## Features

- **Support for Multiple Formats**: Handles both CSV and XML input files.
- **Data Validation**: Ensures all transaction references are unique and that the end balance of each transaction is
  correct.
- **Failure Reporting**: Generates a detailed report of failed records, including the reason for each failure.

## Getting Started

### Prerequisites

- Node.js (version 12 or newer recommended)
- npm (normally comes with Node.js)

### Installation

Clone the repository to your local machine:

   ```sh
   git clone https://github.com/TrusterZero/rabobank-assignment.git
   cd rabobank-assignment
   ```

### Install the necessary dependencies:

```sh
npm install
```

### Usage

To process statement records, place your CSV and XML files in the records directory and run:

```sh
npm start
```

This will read the files, validate the records, and log any failures to the console.
