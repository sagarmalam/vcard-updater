const mysql = require('mysql');
const xml2js = require('xml2js');
const winston = require('winston');

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'vcard-updater' },
  transports: [
    new winston.transports.File({ filename: 'vcard-updater.log' }),
  ],
});

// Database connection parameters
const connection = mysql.createConnection({
  host: 'your_host',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});

connection.connect(err => {
  if (err) {
    logger.error('Connection to database failed: ' + err.stack);
    return;
  }
  logger.info('Connected to database.');
});

// Select all vCards
connection.query('SELECT username, vcard FROM vcard', (err, results) => {
  if (err) {
    logger.error('Failed to query vCards: ' + err);
    return;
  }

  results.forEach(row => {
    const username = row.username; // Use username instead of id
    const vcardXML = row.vcard;
    if (vcardXML) {
      xml2js.parseString(vcardXML, (err, result) => {
        if (err) {
          logger.warning(`Failed to parse XML for vCard USERNAME: ${username}`);
          return;
        }

        // Check for DESC element
        if (!result.vCard.DESC) {
          result.vCard.DESC = ["chat"];
          const builder = new xml2js.Builder();
          const updatedVcardXML = builder.buildObject(result);

          // Update the vCard in the database
          connection.query('UPDATE vcard SET vcard = ? WHERE username = ?', [updatedVcardXML, username], err => {
            if (err) {
              logger.error(`Failed to update vCard USERNAME: ${username}: ` + err);
              return;
            }
            logger.info(`Updated vCard USERNAME: ${username} with <DESC>chat</DESC>`);
          });
        } else {
          logger.debug(`vCard USERNAME: ${username} already has <DESC> element`);
        }
      });
    } else {
      logger.debug(`vCard USERNAME: ${username} is NULL, skipping...`);
    }
  });
});

// Close the connection
connection.end(err => {
  if (err) {
    logger.error('Error closing the database connection: ' + err);
    return;
  }
  logger.info('Database connection closed.');
});