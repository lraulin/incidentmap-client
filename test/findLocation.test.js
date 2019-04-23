const { geocode } = require("../server/findLocation");
const expect = require("chai").expect;

describe("#geocode()", function() {
  context("Washington, DC", function() {
    it("should return {lat: 38.9071923, lng: -77.0368707}", async function() {
      const location = "Washington, DC";
      const answer = await geocode(location);
      expect(answer.lat).to.equal(38.9071923);
      expect(answer.lng).to.equal(-77.0368707);
    });
  });
});
