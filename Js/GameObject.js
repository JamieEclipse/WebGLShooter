//Base game object provides stub functions and basic members
"use strict"


function GameObject(game, properties)
{
	//Store a reference back to the game
	this.game = game;

	//Store a reference back to the object's default values
	this.properties = properties;
}


GameObject.prototype.Update = function(deltaTime) { }


//Called when this GameObject is removed from the game
GameObject.prototype.Destroy = function() { }


//Alternative update loop to call when the game is suspended (i.e. unfocused)
GameObject.prototype.UpdateSuspended = function(deltaTime) { };


GameObject.prototype.Draw = function(gl) { }


//Try to find the named property's value, fall back to defaultValue
GameObject.prototype.GetProperty = function(name, defaultValue)
{
	//Fall back to default value
	var value = defaultValue;

	//Attempt to get value from properties
	if(this.properties !== undefined)
	{
		if(name in this.properties)
		{
			value = this.properties[name];
		}
	}
	
	return value;
}

//Write the property called "name" into this[name] if it exists, otherwise use defaultValue.
GameObject.prototype.LoadProperty = function(name, defaultValue)
{
	this[name] = this.GetProperty(name, defaultValue);
}

//Same as LoadProperty, but constructs a vector from the loaded value - default value must be of the form [x, y, z]
GameObject.prototype.LoadVectorProperty = function(name, defaultValue = [0, 0, 0])
{
	this[name] = vec3.fromValues(...this.GetProperty(name, defaultValue));
}