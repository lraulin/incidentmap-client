export const twitterConfig = {
  consumerKey: "0aBMBHwGQ5hTQd94d992rcOp3",
  consumerSecret: "kQRukAeQ4iTXjYqENBjzmCbYB9dkkBNCqq3wYVwWT0GHSmkzV2",
  accessToken: "1064892450509127680-kdJCmE8NTGr7VMvbnS1m3Wuhzm5fCS",
  accessTokenSecret: "jlss2CUc8oJcxSPryqp1AAqbOa8U0MUG4rzClqrgeNNsN"
};

export const googleMapsApiKey = "AIzaSyDsJbBHLkXK89HbtfMNG1o80-roNY295iU";

export const firebaseConfig = {
  user: "leeraulin@live.com",
  password: "N0r0s#t!",
  uid: "mzNlcv4lxvhRfeWcpjz7rIKZhYT2",
  apiKey: "AIzaSyCOrf2RgpjE0C2IvoX3-6SC90Jr9MDNEKk",
  messagingSenderId: "379333459385"
};

// mongo "mongodb://cluster0-shard-00-00-ochku.mongodb.net:27017,cluster0-shard-00-01-ochku.mongodb.net:27017,cluster0-shard-00-02-ochku.mongodb.net:27017/test?replicaSet=Cluster0-shard-0" --ssl --authenticationDatabase admin --username tmadmin --password <PASSWORD>
// mongoimport --uri "mongodb://cluster0-shard-00-00-ochku.mongodb.net:27017,cluster0-shard-00-01-ochku.mongodb.net:27017,cluster0-shard-00-02-ochku.mongodb.net:27017/test?replicaSet=Cluster0-shard-0" --ssl -u tmadmin -p 'Dwp2v3hYAsdJKVpY' --authenticationDatabase admin  --db tweetmap --collection tweets --drop --file ./tweets_export_1549295200092.json

// connect with Compass
// mongoimport --uri "mongodb+srv://cluster0-ochku.mongodb.net/test" --collection tweets --drop --file ./tweets_export_1549295200092.json

// mongoimport --host Cluster0-shard-0/cluster0-shard-00-00-ochku.mongodb.net:27017,cluster0-shard-00-01-ochku.mongodb.net:27017,cluster0-shard-00-02-ochku.mongodb.net:27017 --ssl --username tmadmin --password Dwp2v3hYAsdJKVpY --authenticationDatabase admin --db tweetmap --collection tweets --type json --file tweets_export_1549295200092.json
