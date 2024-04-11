const xml2js = require('xml2js');

// Example input
const inputXML = '<vCard><N><GIVEN>John</GIVEN><FAMILY>Doe</FAMILY></N></vCard>';

// Parse the input XML
xml2js.parseString(inputXML, (err, result) => {
  if (err) {
    console.error('Error parsing XML:', err);
    return;
  }

  // Check if DESC element exists, if not, add it
  if (!result.vCard.DESC) {
    result.vCard.DESC = ["chat"];
  }

  // Set up the builder
  const builder = new xml2js.Builder({
    xmldec: { version: '1.0', encoding: 'UTF-8', standalone: null },
    renderOpts: { 'pretty': false }
  });

  // Convert the object back to an XML string
  let updatedVcardXML = builder.buildObject(result);

  // Manually remove the XML declaration if it's still present
  updatedVcardXML = updatedVcardXML.replace(/^<\?xml.*\?>/, '');

  console.log(updatedVcardXML); // Output the updated XML
});
