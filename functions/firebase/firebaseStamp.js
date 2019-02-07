const stampit = require("@stamp/it");
const admin = require("firebase-admin");

module.exports.firebaseStamp = stampit({
  props: {
    db: null
  },
  init({ serviceAccount, databaseURL }) {
    const credential = admin.credential.cert(serviceAccount);
    admin.initializeApp({ credential, databaseURL });
    this.db = admin.database();
  },
  methods: {
    // Save Tweet to Firebase, adding to tweets node with id_str as key
    saveTweet(tweet) {
      const datedTweet = { db_created: Date().toString(), ...tweet };
      this.db
        .ref("tweets")
        .child(datedTweet.id_str)
        .update(datedTweet, err => {
          if (err) {
            console.log(err);
          } else {
            console.log("Tweet added successfully!".green);
          }
        });
    }
  }
});
