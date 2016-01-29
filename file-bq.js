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
var data = ''

var moment = require('moment')

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
                'timestamp': moment(tweet.timestamp_ms, 'x').format('YYYY-MM-DD HH:mm:ss'),
                'id_str': tweet.id_str,
                'text': tweet.text,
                'lang': tweet.lang,
                'favorited': tweet.favorited,
                'favorite_count': tweet.favorite_count,
                'retweeted': tweet.retweeted,
                'retweet_count': tweet.retweet_count,
                'hashtags': tweet.entities.hashtags.map(h => {
                    return { 'text': h.text }
                }),
                'users_mentionned': tweet.entities.user_mentions.map(h => {
                    return { 'screen_name': h.screen_name }
                }),
                'user': {
                    'name': tweet.user.name,
                    'screen_name': tweet.user.screen_name,
                    'lang': tweet.user.lang,
                    'followers_count': tweet.user.followers_count,
                    'friends_count': tweet.user.friends_count,
                    'verified': tweet.user.verified,
                }
            }
        } catch (e) {
            return null
        }
    }).filter(el => el != null), (err, insertErrors, apiResponse) => {
        if (err) throw err
        if (insertErrors.length == 0) {
            console.log(tweets.length + ' tweets inserted')
        } else console.log(insertErrors[0].errors)
        callback()
    })
}  

stream.on('data', chunk => {
    stream.pause()
    if (_i++ < 1000) {
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

