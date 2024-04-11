# vCard Updater Project

This Node.js project updates vCards in a database by adding a `<DESC>` tag with a value of "chat" if it's missing.

## Setup

To set up the project, follow these steps:

1. Ensure Node.js and npm are installed on your system.
2. Download the project and extract it.
3. Navigate to the project directory and run `npm install` to install the required dependencies.

## Configuration

Before running the application, you'll need to configure your database connection details in `index.js`. Replace the placeholders for the host, user, password, and database with your actual MySQL database details.

## Running the Application

Run the application using the following command:

```bash
node index.js
```

This will start the process of updating the vCards in your database as per the specified logic.

## Running Tests

To run the unit tests, use the following command:

```bash
npm test
```

This will execute the tests defined in the `tests` directory, ensuring the application logic works as expected.

## Logging

The application uses Winston for logging. Logs are saved to `vcard-updater.log` in the project directory, providing details about the application's operations and any errors.

---

For more information or to report issues, please refer to the project's GitHub page or contact the maintainer.
