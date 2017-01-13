const MongoClient = require('mongodb').MongoClient

var url = 'mongodb://localhost:27017'

function getRandomData() {
    return {
        "temp" : Math.random() * 100,
        "pressure" : 1000 + Math.random() * 50,
        "date" : new Date()
    }
}

function connect() {    
    return new Promise((resolve, reject) => {
        console.log("> Connecting to MongoDB.")
        MongoClient.connect(url, (err, db) => {
            if (err) reject(err)
            else resolve(db)
        })
    })
}

function getDataCollection(db) {
    return db.collection('data');
}

function insert(db, data) {    
    return new Promise((resolve, reject) => {
        console.log("> Inserting ", data)
        let col = getDataCollection(db);
        col.insert(data, (err, result) => {
            if (err) reject(err)
            else (resolve(result))
        })
    })
}

function getAllData(db) {
    return new Promise((resolve, reject) => {
        console.log("> Getting all data.")
        let col = getDataCollection(db);
        col.find({}).toArray((err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
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

