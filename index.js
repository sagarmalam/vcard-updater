const mysql = require('mysql');
const util = require('util');
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

// Promisify the query function
connection.query = util.promisify(connection.query).bind(connection);

(async () => {
  try {
    await connection.connect();

    const results = await connection.query('SELECT username, vcard FROM vcard');
    for (let row of results) {
      let { username, vcard: vcardXML } = row;
      if (vcardXML) {
        let parsed = await util.promisify(xml2js.parseString)(vcardXML);
        if (!parsed.vCard.DESC) {
          parsed.vCard.DESC = ["chat"];
          let builder = new xml2js.Builder();
          let updatedVcardXML = builder.buildObject(parsed);
          await connection.query('UPDATE vcard SET vcard = ? WHERE username = ?', [updatedVcardXML, username]);
          logger.info(`Updated vCard USERNAME: ${username} with <DESC>chat</DESC>`);
        } else {
          logger.debug(`vCard USERNAME: ${username} already has <DESC> element`);
        }
      } else {
        logger.debug(`vCard USERNAME: ${username} is NULL, skipping...`);
      }
    }
  } catch (err) {
    logger.error('An error occurred: ' + err.message);
  } finally {
    connection.end();
  }
})();