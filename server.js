var express = require('express');
var fs = require('fs');
var request = require('fs');
var cheerio = require('cheerio');
var app = express();


app.get('/scrape', function(req, res) {

    // The URL to scrape from
    url = 'http://www.imdb.com/title/tt0087363/';

    // Structure of request call

    // The first parameter

    // The callback function takes 3 params, error and response state code and the html

    request(url, function(error, response, html) {

    	// First check for errors
    	if(!error) {
    		// use cheerio library on the returned html

    		var $ = cheerio.load(html);

    		// Define variables we're going to capture

    		var title, release, rating;

    		var json = { title : "", release : "", rating : ""};
    	}
    })

})

app.listen('8081');

console.log("this is on 8081");

exports = module.exports = app;