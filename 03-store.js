// Require Twitter library
var twitter = require('twitter')
// Load credentials: https://apps.twitter.com/
var credentials = require('./credentials.json')

// Initiate the client
var client = new twitter(credentials.twitter)

var gcloud = require('gcloud')(credentials.bigquery)

// Connect to BigQuery Twitter table
var bigquery = gcloud.bigquery()
var dataset = bigquery.dataset('general_assembly')
var table = dataset.table('twitter')

// Connect to the stream 'data'
client.stream('statuses/filter', { track: 'data,science' }, stream => {
    // Display the tweets
    stream.on('data', tweet => {
        // Insert the read tweet to BigQuery table
        table.insert({ // Respect the schema
            'created_at': tweet.created_at,
            'id_str': tweet.id_str,
            'user_name': tweet.user.name,
            'text': tweet.text
        }, (err, insertErrors, apiResponse) => {
            if (err) throw err
            console.log([insertErrors.length == 0 ? '[INSERTED] ' : '[ERROR] ', tweet.text].join(' '))
        })
    }).on('error', error => {
        throw error
    })
})