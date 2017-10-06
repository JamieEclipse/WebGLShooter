//Constructor
function Game()
{
	//Run state
	this.suspended = false;
	//TODO: Pause - another bool or switch to an "enum"?
	
	//Get window
	this.window = $("#glCanvas");
	
	//Initialise renderer
	this.renderer = new Renderer(this);

	//Initialise physics
	this.physics = new Physics(this);
	
	//Named callback arrays for communication inside and outside of the game
	this.events = { };
	
	//Set up suspended and unsuspended events
	this.RegisterEventListener("Suspended", function(game, args) { game.suspended = true; });
	this.RegisterEventListener("Unsuspended", function(game, args) { game.suspended = false; });
	
	//Initialise objects
	//TODO: Do this in a derived class or load from data
	var wall1 = new Wall(this);
	var wall2 = new Wall(this);
	var wall3 = new Wall(this);
	var wall4 = new Wall(this);
	wall1.position.set([-0.5, 0.5, 0]);
	wall2.position.set([0.5, 0.5, 0]);
	wall3.position.set([-0.5, -1.5, 0]);
	wall4.position.set([0.5, -1.5, 0]);
	var player = new Player(this);
	player.position.set([0, 4, 2]);
	this.objects = [player, wall1, wall2, wall3, wall4];
};


//Run game
Game.prototype.Run = function()
{
	//Main update loop
	var UpdateLoop = function(game)
	{
		//Constant tick time
		const deltaTime = 1 / 30;
		const deltaTimeMs = 1000 * deltaTime;
		
		//Schedule next tick immediately
		//TODO: Throttle if ticks overlap
		setTimeout(UpdateLoop, deltaTimeMs, game);
		
		//Catch any runtime exceptions without crashing the game
		try
		{
			//Update
			game.Update(deltaTime, game.suspended ? "UpdateSuspended" : "Update");
		}
		catch(exception)
		{
			console.error(exception);
		}
	};
	
	//Begin the update loop
	UpdateLoop(this);
}


//Perform one game logic update
Game.prototype.Update = function(deltaTime, updateType)
{
	//Update physics
	this.physics.Update(deltaTime);

	//Update all game objects
	for(i in this.objects)
	{
		this.objects[i][updateType](deltaTime);
	}
	
	//Render
	this.renderer.Draw();
}


//Call all callbacks for the named event
Game.prototype.BroadcastEvent = function(eventName)
{
	//Check the event exists
	if(!(eventName in this.events))
	{
		console.log("Event " + eventName + " has no listeners.");
		return;
	}
	
	//Inform all listeners
	for(var i in this.events[eventName])
	{
		var listener = this.events[eventName][i];
		listener.callback(this, listener.args);
	}
}


//Register a callback for the named event Callbacks should take the form: function(game, args),
//where args is the same args passed ito RegisterEventListener.
Game.prototype.RegisterEventListener = function(eventName, callback, args)
{
	//Add event if it doesn't exist
	if(!(eventName in this.events))
	{
		this.events[eventName] = [];
	}
	
	//Add callback
	this.events[eventName].push({
		callback: callback,
		args: args
	});
}


//Suspend or unsuspend the game - a suspended game will be considered "unfocused" and will swap updates to UpdateSuspended
Game.prototype.Suspend = function() { this.BroadcastEvent("Suspended"); }
Game.prototype.Unsuspend = function() { this.BroadcastEvent("Unsuspended"); }