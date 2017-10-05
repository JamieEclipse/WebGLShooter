//Base game object provides stub functions and basic members
"use strict"


function GameObject(game)
{
	//Store a reference back to the game
	this.game = game;

	this.position = vec3.create();
}


GameObject.prototype.Update = function(deltaTime) { }


//Alternative update loop to call when the game is suspended (i.e. unfocused)
GameObject.prototype.UpdateSuspended = function(deltaTime) { };


GameObject.prototype.Draw = function(gl) { }
