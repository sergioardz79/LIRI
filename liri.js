// code to read and set any environment variables with the dotenv package:
require("dotenv").config();

// code required to import the keys.js file and store it in a variable.
var keys = require("./keys.js");

// code to require axios package, moment and fs
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

// code to fetch the command option to execute based on arguments
var term = process.argv[2];

// code to fetch query contents based on arguments
var queryContent = process.argv.slice(3).join("+");

// npm node-spotify-api
// Usage with promises
// This package also optionally works with promises. Just omit the callback parameter and the search method returns a promise object containing the response: 
var Spotify = require('node-spotify-api');

// code for function when command is spotify-this-song
function spotifyThisSong(songName) {
    var spotify = new Spotify(keys.spotify);
    spotify
        .search({ type: 'track', query: songName, limit: 1 })
        .then(function (response) {
            let song = response.tracks.items;
            var songResults =
                "Artist: " + song[0].album.artists[0].name +
                "\nSong: " + song[0].name +
                "\nSong Link: " + song[0].external_urls.spotify +
                "\nAlbum: " + song[0].album.name;
            console.log(songResults);
        })
        .catch(function (err) {
            console.log(err);
        });
}

// code for function when command is concert-this
function fetchConcert(artistName) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    axios
        .get(queryUrl)
        .then(
            function (response) {
                info = response.data;
                if (info.length === 0) {
                    var noInfo = "There are no info or upcoming concerts for that artist. You can try other one."
                    console.log(noInfo);
                }
                else {
                    for (i = 0; i < info.length; i++) {
                        var concertsResults =
                            "Result # " + (i + 1) +
                            "\nName of the venue: " + info[i].venue.name +
                            "\nVenue location: " + info[i].venue.city + ", " + info[i].venue.region + ", " + info[i].venue.country +
                            "\nDate of the event: " + moment(info[i].datetime).format('MM/DD/YYYY');
                        console.log(concertsResults);
                    }
                }
            }
        )
        .catch(function (error) {
            console.log(error);
        });
}

// code for function when command is movie-this
function fetchMovie(movieName) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    axios
        .get(queryUrl)
        .then(
            function (response) {
                var info = response.data;
                if (info.Ratings.length > 1) {
                    var Rotten = info.Ratings[1].Value;
                }
                else {
                    var Rotten = "N/A";
                }
                var movieResults =
                    "* Title of the movie: " + info.Title +
                    "\n* Year the movie came out: " + info.Year +
                    "\n* IMDB Rating of the movie: " + info.imdbRating +
                    "\n* Rotten Tomatoes Rating of the movie: " + Rotten +
                    "\n* Country where the movie was produced: " + info.Country +
                    "\n* Language(s) of the movie: " + info.Language +
                    "\n* Plot of the movie: " + info.Plot +
                    "\n* Actors in the movie: " + info.Actors;
                console.log(movieResults);
                // if (info.Ratings.length > 1) {
                //     if (info.Ratings[1].Source === "Rotten Tomatoes") {
                //         console.log(
                //             "* Rotten Tomatoes Rating of the movie: " + info.Ratings[1].Value);
                //     }
                // }
                // else {
                //     console.log("--- No Rotten Tomatoes Rating available for " + info.Title + " ---");
                // }
            }
        )
        .catch(function (error) {
            console.log(error);
        });
}

// code for function when command is do-what-it-says
function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) throw err;

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            options(dataArr[0], dataArr[1]);
        }
        else if (dataArr.length === 1) {
            options(dataArr[0]);
        }
    })
}

// code for function to choose a specific command when using the app
function options(commandData, functionData) {
    switch (commandData) {
        case 'spotify-this-song':
            if (!functionData) {
                functionData = "The Sign Ace of Base";
                spotifyThisSong(functionData);
            }
            else {
                spotifyThisSong(functionData);
            }
            break;
        case 'movie-this':
            if (!functionData) {
                functionData = "Mr. Nobody";
                fetchMovie(functionData);
            }
            else {
                fetchMovie(functionData);
            }
            break;
        case 'concert-this':
            if (!functionData) {
                console.log("Please input an artist name");
            }
            else {
                fetchConcert(functionData);
            }
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("LIRI Bot needs a valid command");
    }
}

// code for main function that runs the app
function runApp(argOne, argTwo) {
    options(argOne, argTwo);
}

// calling main function
runApp(term, queryContent);