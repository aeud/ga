var credentials = require('./credentials.json')

var gcloud = require('gcloud')(credentials.bigquery)

var bigquery = gcloud.bigquery()
var dataset = bigquery.dataset('general_assembly')
var table = dataset.table('twitter')

var deleteTwitterTable = callback => {
    table.exists((err, exists) => { // Delete only if exists
        if (err) throw callback(err, null)
        exists ? table.delete(callback) : callback(null, true) // If it exists, delete the table and return callback, otherwise, return callback
    })
}

var createTwitterTable = callback => {
    deleteTwitterTable((err, apiResponse) => {  // Delete only if exists
        if (err) throw callback(err, null)
        dataset.createTable('twitter', { // Create the new table ...
            'schema': 'created_at,id_str,user_name,text' // ... with this schema
        }, callback) // .. then return callback
    })   
}

createTwitterTable((err, newTable, apiResponse) => {
    if (err) throw err;
    console.log('Twitter table created')
})