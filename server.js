var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();


app.get('/scrape', function(req, res) {

    // The URL to scrape from
        var songArray = [
         'grace',
         '10-000-reasons-bless-the-lord',
         'holy-spirit',
         'cornerstone',
         'how-great-is-our-god'
        ];
    // var songArray = [
    //     'blessed-assurance', 
    //     'lord-i-need-you', 
    //     'grace',
    //     '10-000-reasons-bless-the-lord',
    //     'holy-spirit','cornerstone',
    //     'how-great-is-our-god'
    //     ];

    for(var i = 0; i < songArray.length; i++) {

        // Define variables we're going to capture

        var url = 'http://www.worshiptogether.com/songs/' + songArray[i];


        // Structure of request call

        // The first parameter

        // The callback function takes 3 params, error and response state code and the html

        request(url, function(error, response, html) {

            var title, author, general_references, raw_lyrics, filename;

            var json = { api_key : "shibboleet",
                            song : {
                                title : "",
                                author : "", 
                                general_references : "",
                                raw_lyrics : "" 
                    }
                };


            // First check for errors
            if(!error) {
                // use cheerio library on the returned html
                var $ = cheerio.load(html);

                // Get the title

                $('h1').filter(function() {

                    var data = $(this);

                    title = data.contents().first().text().trim();

                    json.song.title = title; 

                    filename = title.replace(/\s+/g, '-').toLowerCase();               
                })


                var data = $('div.song_taxonomy > div.row ');

                // // Get the writer 

                artist = data.find("p:contains('Writer(s):')").contents().last().text().trim();

                //artist = $('div.song_taxonomy > div.row > p').contents().eq(2).text().trim();

                json.song.artist = artist; 
                
                // Get the reference            

                general_references = data.find("p:contains('Scripture Reference')").contents().last().text().trim();

                general_references = general_references.replace(/-\d+(\:\d+)?/g, "");

                json.song.general_references = general_references;  

                // Get the lyrics

                raw_lyrics = $('div.chord-pro-line, div.chord-pro-br').map(function() {
                    if($(this).hasClass('chord-pro-br')) {
                        return "\n";
                    }
                    return $(this).find('div.chord-pro-lyric').contents().map(function() {
                        return $(this).text();
                }).toArray().join('');
                }).toArray().join('\n'); 

                json.song.raw_lyrics = raw_lyrics.replace(/(\r)/gm,"");    
                
                fs.writeFileSync((filename + '.json'),JSON.stringify(json, null, 4) )                 

                request.post('http://c4tk.somamou.org/songs', {form: json}, function(err, httpResponse, body){

                    console.log('here');
                    
                    console.log(httpResponse.statusCode);
                    console.log(err);
                    if(err) throw err;
                    
                });

                console.log(json);


                // To write to the system we will use the built in 'fs' library.
                // In this example we will pass 3 parameters to the writeFile function
                // Parameter 1 :  output.json - this is what the created filename will be called
                // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
                // Parameter 3 :  callback function - a callback function to let us know the status of our function

            } // end if error
             
        })  // end request 
    } // end for loop


    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!')

});


app.listen('8081');

console.log("this is on 8081");


exports = module.exports = app;