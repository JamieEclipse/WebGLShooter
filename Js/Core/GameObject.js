//Base game object provides stub functions and basic members
"use strict"


function GameObject(game, properties)
{
	//Define property loading functions
	PropertyLoader.call(this);

	//Store a reference back to the game
	this.game = game;

	//Store a reference back to the object's default values
	this.properties = properties;

	//Array of components
	this.components = { };
}


//Call a function on all components
GameObject.prototype.CallOnComponents = function(functionName)
{
	for(var i in this.components)
	{
		this.components[i][functionName](...Array.prototype.slice.call(arguments, 1));
	}
}


//Main update function
GameObject.prototype.Update = function(deltaTime) { this.CallOnComponents("Update", arguments); };


//Alternative update loop to call when the game is suspended (i.e. unfocused)
GameObject.prototype.UpdateSuspended = function(deltaTime) { this.CallOnComponents("UpdateSuspended", arguments); };


//Draw function - called by the renderer
GameObject.prototype.Draw = function() { this.CallOnComponents("Draw", arguments); };


//Called when this GameObject is removed from the game
GameObject.prototype.Destroy = function() { this.CallOnComponents("Destroy", arguments); };
