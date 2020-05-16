var express = require("express");
var request = require("request");

var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){	
	res.render("search");
});

app.get("/results", function(req, res){
	
	var url = "https://www.alphavantage.co/query?"
	var func = "function=TIME_SERIES_INTRADAY";
	var ticker = "&symbol=";
	var interval = "&interval=5min";	
	var key = "&apikey=61TGDVCRC952FAH9";

	//get user inputted ticker
	ticker = ticker + req.query.search.toUpperCase();

	request(url + func + ticker + interval + key, function(error, response, body){
		if(error){
			console.log("Something went wrong");
			console.log(error);
		}else{
			
			//must parse the body string to get it into an object
			var parsedData = JSON.parse(body);

			//access the most recently updated price
			var recent = parsedData["Meta Data"]["3. Last Refreshed"];
			var price = parsedData["Time Series (5min)"][recent]["4. close"];
			
			//format to two dec places and send to html page
			price = Number(price).toFixed(2);
			// console.log(price);

			res.render("results", {price: price});
		}
	});

});

app.listen(3000, function(){
	console.log("Server is listening...");
});