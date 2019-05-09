const expect = require("chai").expect;
const { makeQueryString } = require("../src/danDb");

describe("#makeQueryString()", function() {
  context("Startdate, enddate, text", function() {
    it("should return ?from=%272015-07-08%27&to=%272019-05-06T23:59:59%27&search=hello", function() {
      const filterOptions = {
        startDate: new Date(2015, 07, 08),
        endDate: new Date(2019, 05, 06),
        text: "hello",
      };
      const expected =
        "?from=%272015-07-08%27&to=%272019-05-06%27&search=hello";
      const answer = makeQueryString({ ...filterOptions });
      expect(answer.lat).to.equal(38.9071923);
      expect(answer.lng).to.equal(-77.0368707);
    });
  });
});
