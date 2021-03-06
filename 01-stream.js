// Require Twitter library
var twitter = require('twitter')
// Load credentials: https://apps.twitter.com/
var credentials = require('./credentials.json')

// Initiate the client
var client = new twitter(credentials.twitter)

// Connect to the stream 'data'
client.stream('statuses/filter', { track: 'data,science' }, stream => {
    // Display the tweets
    stream.on('data', tweet => {
        console.log([tweet.text, tweet.entities.hashtags.map(h => h.text)])
    }).on('error', error => {
        throw error
    })
})