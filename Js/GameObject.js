//Base game object provides stub functions and basic members
"use strict"


function GameObject(game)
{
	this.position = vec3.create();
	this.velocity = vec3.create();
}


GameObject.prototype.Update = function(game, deltaTime) { }


//Alternative update loop to call when the game is suspended (i.e. unfocused)
GameObject.prototype.UpdateSuspended = function(game, deltaTime) { };


GameObject.prototype.Draw = function(gl) { }
