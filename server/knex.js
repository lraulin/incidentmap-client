const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "postgres",
    database: "map_transition_db",
  },
});

const insert = async data => knex("incident").insert(data);

const getAllData = async () =>
  knex("incident")
    .select()
    .from("incident")
    .timeout(1000);

const testData = {
  incident: "1",
  created: "1",
  latitude: 50,
  longitude: -25,
  injuries: 0,
  fatalities: 5000,
  tweet_id: "5",
  description: "A quick brown fox jumped over the lazy dog.",
  type: "tweets",
  user_id: "huegrection",
  crisis_type: "",
};

const main = async () => {
  try {
    const res = await insert(testData);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

main();
