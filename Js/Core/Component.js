//Base component to be attached to a GameObject
"use strict"

function Component(gameObject, properties)
{
	//Define property loading functions
	PropertyLoader.call(this);

	//Store properties
	this.properties = properties;

	//Store a reference back to the gameObject
	this.gameObject = gameObject;

	//Store a shortcut back to the game
	this.game = this.gameObject.game;
}


Component.prototype.Update = function(deltaTime) { };


Component.prototype.Destroy = function() { };
