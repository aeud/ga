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
            'schema': {
                'fields': [
                    { 'name': 'timestamp', 'type': 'TIMESTAMP', 'mode': 'NULLABLE' },
                    { 'name': 'id_str', 'type': 'STRING', 'mode': 'NULLABLE' },
                    { 'name': 'text', 'type': 'STRING', 'mode': 'NULLABLE' },
                    { 'name': 'lang', 'type': 'STRING', 'mode': 'NULLABLE' },
                    { 'name': 'retweeted', 'type': 'BOOLEAN', 'mode': 'NULLABLE' },
                    { 'name': 'retweet_count', 'type': 'INTEGER', 'mode': 'NULLABLE' },
                    { 'name': 'favorited', 'type': 'BOOLEAN', 'mode': 'NULLABLE' },
                    { 'name': 'favorite_count', 'type': 'INTEGER', 'mode': 'NULLABLE' },
                    { 'name': 'hashtags', 'type': 'RECORD', 'mode': 'REPEATED', 'fields': [
                        { 'name': 'text', 'type': 'STRING', 'mode': 'NULLABLE' },
                    ] },
                    { 'name': 'users_mentionned', 'type': 'RECORD', 'mode': 'REPEATED', 'fields': [
                        { 'name': 'screen_name', 'type': 'STRING', 'mode': 'NULLABLE' },
                    ] },
                    { 'name': 'user', 'type': 'RECORD', 'mode': 'NULLABLE', 'fields': [
                        { 'name': 'screen_name', 'type': 'STRING', 'mode': 'NULLABLE' },
                        { 'name': 'name', 'type': 'STRING', 'mode': 'NULLABLE' },
                        { 'name': 'lang', 'type': 'STRING', 'mode': 'NULLABLE' },
                        { 'name': 'followers_count', 'type': 'INTEGER', 'mode': 'NULLABLE' },
                        { 'name': 'friends_count', 'type': 'INTEGER', 'mode': 'NULLABLE' },
                        { 'name': 'verified', 'type': 'BOOLEAN', 'mode': 'NULLABLE' },
                    ] },
                ]
            }
        }, callback) // .. then return callback
    })   
}

createTwitterTable((err, newTable, apiResponse) => {
    if (err) throw err;
    console.log('Twitter table created')
})