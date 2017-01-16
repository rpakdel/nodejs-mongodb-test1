const MongoClient = require('mongodb').MongoClient

var url = 'mongodb://10.40.186.116:27017/sensors'

function getRandomData() {
    return {
        "temp" : Math.random() * 100,
        "pressure" : 1000 + Math.random() * 50,
        "date" : new Date()
    }
}

function connect() {    
  console.log("> Connecting to MongoDB.")
  return MongoClient.connect(url)
}

function getDataCollection(db) {
    return db.collection('data');
}

function insert(db, data) {    
  console.log("> Inserting ", data)
  let col = getDataCollection(db)
  return col.insert(data)
}

function getAllData(db) {
  console.log("> Getting all data.")
  let col = getDataCollection(db)
  return col.find({}).toArray()
}

function insertRandomData(db) {
    let data = getRandomData()
    insert(db, data)
    .then(result => console.log(result))
    .catch(err => console.log("ERROR", err))
}

connect()
    .then(db => {
        console.log("> Connected to MongoDB.")

        getAllData(db)
            .then(result => console.log("Data: ", result))
            .catch(err => console.log("ERROR: ", err))

        setInterval(() => insertRandomData(db), 1000)
        return db
    })
    .then(db => getAllData(db)
        .then(result => console.log(result)))
    .catch(err => console.log("> ERROR: ", err))

