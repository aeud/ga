// Load credentials: https://apps.twitter.com/
var credentials = require('./credentials.json')

var fs = require('fs')

var stream = fs.createReadStream('./tweets.json')

var gcloud = require('gcloud')(credentials.bigquery)

// Connect to BigQuery Twitter table
var bigquery = gcloud.bigquery()
var dataset = bigquery.dataset('general_assembly')
var table = dataset.table('twitter')

stream.on('data', chunk => {
    var tweets = String(chunk).split('\n').map(el => JSON.parse(el))
    table.insert(tweets.map(tweet => {
        return { // Respect the schema
            'created_at': tweet.created_at,
            'id_str': tweet.id_str,
            'user_name': tweet.user.name,
            'text': tweet.tex
        }
    }), (err, insertErrors, apiResponse) => {
        if (err) throw err
        if (insertErrors.length == 0) {
            console.log(tweets.length + ' tweets inserted')
        }
    })

})