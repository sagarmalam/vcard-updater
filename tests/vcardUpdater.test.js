const { parseString, Builder } = require('xml2js');

// Example test for the XML parsing and modification functionality
describe('vCard XML Parsing and Modification', () => {
  test('adds <DESC>chat</DESC> if missing', done => {
    const inputXML = '<vCard><N><GIVEN>John</GIVEN><FAMILY>Doe</FAMILY></N></vCard>';

    parseString(inputXML, (err, result) => {
      if (err) {
        done(err);
        return;
      }

      if (!result.vCard.DESC) {
        result.vCard.DESC = ["chat"];
      }
      const builder = new Builder();
      const updatedVcardXML = builder.buildObject(result);

      // Parse the updated XML to verify the DESC element was added correctly
      parseString(updatedVcardXML, (err, updatedResult) => {
        if (err) {
          done(err);
          return;
        }
        expect(updatedResult.vCard.DESC).toEqual(["chat"]);
        done();
      });
    });
  });
});
