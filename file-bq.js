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
    //console.log(tweets)
    table.insert(tweets.map(el => {
        try {
            return JSON.parse(el)
        } catch (e) {
            return null
        }
    }).filter(el => el != null).map(tweet => {
        try {
            return { // Respect the schema
                'created_at': tweet.created_at,
                'id_str': tweet.id_str,
                'user_name': tweet.user.name,
                'text': tweet.tex
            }
        } catch (e) {
            return null
        }
    }).filter(el => el != null), (err, insertErrors, apiResponse) => {
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
        var stringTweets = String(data).split('\n')
        data = stringTweets.pop()
        insertTweets(stringTweets, () => stream.resume())
        _i = 0
    }
})
stream.on('end', () => {
    console.log('end')
    var stringTweets = String(data).split('\n')
    insertTweets(stringTweets, () => console.log('DONE.'))
})

