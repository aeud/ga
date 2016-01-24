// Require Twitter library
var twitter = require('twitter')
// Load credentials: https://apps.twitter.com/
var credentials = require('./credentials.json')

// Initiate the client
var client = new twitter(credentials.twitter)

var fs = require('fs')

var writeStream = fs.createWriteStream('./tweets.json')
var jsonStream = require('JSONStream')

// Connect to the stream 'data'
client.stream('statuses/filter', { track: 'data,science' }, stream => {
    // Display the tweets
    stream.on('data', tweet => {
        writeStream.write(JSON.stringify(tweet) + '\n')
    }).on('error', error => {
        throw error
    })
})