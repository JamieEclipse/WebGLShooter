//Logs to the console and the screen
"use strict"


function Logger(game)
{
	//Store a reference back to the game
	this.game = game;
	
	//Array of logs - clipped to a max length
	this.logData = [ ];
	
	//Get the html element to print the log to
	this.logElement = $("#logger");
	
	//Create different log verbosities
	var verbosities = [ "log", "warn", "error" ];
	for(var i in verbosities)
	{
		var verbosity = verbosities[i];
		this[verbosity] = function()
		{
			this.GenericLog(...arguments);
		}.bind(this, verbosity);
	}
}


Logger.prototype.GenericLog = function(verbosity)
{
	//Strip verbosity from log arguments
	var logArguments = Array.prototype.slice.call(arguments, 1);
	
	//Log to console
	console[verbosity](...logArguments);
	
	//Push data
	this.logData.push({ verbosity: verbosity, text: logArguments.join(" ") });
	
	//Maintain max length
	if(this.logData.length > 20)
	{
		this.logData = this.logData.splice(1);
	}
	
	//Show on screen
	this.logElement.empty();
	for(var i = this.logData.length - 1; i >= 0; --i)
	{
		var row = this.logElement.append(
			"<div class='" + this.logData[i].verbosity
			+ "'>" + this.logData[i].text + "</div>");
	}
}


Logger.prototype.assert = function(condition)
{
	if(!condition)
	{
		this.error(...Array.prototype.slice.call(arguments, 1));
		throw { };
	}
}
