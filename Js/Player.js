//Player class, responsible for movement, shooting, health etc
"use strict"


function Player(game)
{
	GameObject.call(this, game);
	
	//Contains a "button down" bool for each input action
	this.buttons = { };
	
	//Links one or more keys to an input action
	this.keyBindings = { };
	
	//Ready for input
	this.SetupInput();
	
	//Direction
	this.yaw = 0;
	
	//Offset from player position to camera position
	this.cameraOffset = vec3.create();
	
	//The angle of the sine wave to set the yaw to
	this.suspendedYawChangeAngle = 0.0;
};

Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;


//Bind an array of key codes to one "action" string
Player.prototype.BindKeys = function(keyCodes, action)
{
	for(var i = 0; i < keyCodes.length; ++i)
	{
		this.keyBindings[keyCodes[i]] = action;
	}
}


//Bind events and set up input actions
Player.prototype.SetupInput = function()
{
	//Get element to receive input from
	var doc = document.querySelector("body");
	var obj = this;
	doc.addEventListener("keydown", function() { obj.SetInputAction(true); });
	doc.addEventListener("keyup", function() { obj.SetInputAction(false); });
	
	//Define inputs
	var KeyW = [119, 87];
	var KeyA = [97, 65];
	var KeyS = [115, 83];
	var KeyD = [100, 68];
	var KeyLeft = [37];
	var KeyRight = [39];
	var KeySpace = [32];
	var KeyEscape = [27];
	
	//Bind keys
	this.BindKeys(KeyW, "Forward");
	this.BindKeys(KeyA, "Left");
	this.BindKeys(KeyS, "Backward");
	this.BindKeys(KeyD, "Right");
	this.BindKeys(KeySpace, "Jump");
	this.BindKeys(KeyLeft, "TurnLeft");
	this.BindKeys(KeyRight, "TurnRight");
	this.BindKeys(KeyEscape, "Menu");
}


//Set the current state of an input action
Player.prototype.SetInputAction = function(down)
{
	var inputAction = this.keyBindings[event.keyCode];
	if(inputAction != undefined)
	{
		this.buttons[inputAction] = down;
	}
}


//Main update - move, jump, shoot etc
Player.prototype.Update = function(game, deltaTime)
{
	//Look controls
	//TODO: Mouse look
	var yawChange =
		(this.buttons["TurnRight"] ? 1 : 0)
		- (this.buttons["TurnLeft"] ? 1 : 0);
	this.yaw += 2 * deltaTime * yawChange;
	
	//Movement controls
	var speed = 3;
	var forward =
		(this.buttons["Forward"] ? speed : 0)
		- (this.buttons["Backward"] ? speed : 0);
	var right =
		(this.buttons["Right"] ? speed : 0)
		- (this.buttons["Left"] ? speed : 0);
	
	var sinYaw = Math.sin(this.yaw);
	var cosYaw = Math.cos(this.yaw);
	this.velocity.set([cosYaw * right + sinYaw * forward, 0, cosYaw * -forward + sinYaw * right]);
	
	//Move
	vec3.scaleAndAdd(this.position, this.position, this.velocity, deltaTime);
	
	//Move the camera
	vec3.add(game.renderer.camera.position, this.position, this.cameraOffset);
	game.renderer.camera.yaw = this.yaw;
	
	//Suspend the game
	if(this.buttons["Menu"] === true)
	{
		game.Suspend();
	}
}


//Suspended update - spin slowly
Player.prototype.UpdateSuspended = function(game, deltaTime)
{
	//Position camera
	game.renderer.camera.position.set([0, 0, 2]);
	
	//Slowly spin the camera
	this.suspendedYawChangeAngle += deltaTime * 0.1;
	game.renderer.camera.yaw = Math.sin(this.suspendedYawChangeAngle) * 1.0;
}