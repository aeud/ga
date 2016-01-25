// Load credentials: https://apps.twitter.com/
var credentials = require('./credentials.json')

var fs = require('fs')

var stream = fs.createReadStream('./tweets.json')

var gcloud = require('gcloud')(credentials.bigquery)

// Connect to BigQuery Twitter table
var bigquery = gcloud.bigquery()
var dataset = bigquery.dataset('general_assembly')
var table = dataset.table('twitter')

var tweets = []
var _i = 0;
var data = '';

var insertTweets = (tweets, callback) => {
    console.log(tweets)
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
        callback()
    })
}  

stream.on('data', chunk => {
    stream.pause()
    if (_i++ < 100) {
        data += chunk
        stream.resume()
    } else {
        var tweets = String(chunk).split('\n').map(el => JSON.parse(el))
        data = tweets.pop()
        insertTweets(tweets, () => stream.resume())
        _i = 0
    }
})
stream.on('end', () => {
    var tweets = String(data).split('\n').map(el => JSON.parse(el))
    insertTweets(tweets, () => console.log('DONE.'))
})

