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
        console.log(JSON.stringify(tweet))
    }).on('error', error => {
        throw error
    })
})