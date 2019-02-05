const stampit = require("@stamp/it");
const Privatize = require("@stamp/privitize");
const assert = require("assert");
const mongoCredentials = require("secrets").mongodb;

const Mongo = stampit.compose(
  Privatize,
  {
    name: "FileStore",
    props: {
      MongoClient: require("mongodb").MongoClient,
      client: null,
      db: null
    },
    async init({ url, dbName }) {
      // Create a new MongoClient
      this.client = await this.MongoClient.connect(url, {
        useNewUrlParser: true
      });
      this.db = this.client.db(dbName);
    },
    methods: {
      async insertDocuments({ collectionName, documentArray }) {
        // Get the documents collection
        const collection = this.db.collection(collectionName);
        // Insert some documents
        return await collection.insertMany(documentArray, (err, result) => {
          assert.equal(err, null);
          assert.equal(3, result.result.n);
          assert.equal(3, result.ops.length);
          console.log("Inserted 3 documents into the collection");
          return result;
        });
      }
    },
    conf: {
      bucket: process.env.UPLOAD_BUCKET
    },
    statics: {
      setDefaultBucket(bucket) {
        return this.conf({ bucket });
      }
    }
  }
);
