var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();


app.get('/scrape', function(req, res) {

    // The URL to scrape from
    url = 'http://www.worshiptogether.com/songs/blessed-assurance';

    // Structure of request call

    // The first parameter

    // The callback function takes 3 params, error and response state code and the html

    request(url, function(error, response, html) {

        // First check for errors
        if(!error) {
            // use cheerio library on the returned html

            var $ = cheerio.load(html);

            // Define variables we're going to capture

            var title, writer, lyrics, references, theme, tempo;

            var json = { title : "", writer : "", lyrics : "", references : "", theme : "", tempo : ""};

            // Get the title

            $('h1').filter(function() {

                var data = $(this);

                title = data.text();

                json.title = title;                
            })

            // Get the reference

            $('div.song_taxonomy > div.row > p').filter(function() {
                var data = $(this);

                writer = data.children().first().text();

                reference = data.children().last().text();

                json.writer = writer;

                json.reference = reference;

            })

            console.log(json);
        }

        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1 :  output.json - this is what the created filename will be called
        // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
        // Parameter 3 :  callback function - a callback function to let us know the status of our function

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

            console.log('File successfully written! - Check your project directory for the output.json file');

        })

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send('Check your console!')

    });
})

app.listen('8081');

console.log("this is on 8081");


exports = module.exports = app;