//Constructor
function Game()
{
	try
	{
		//Create logger
		try
		{
			this.logger = new Logger(this);
		}
		catch(exception)
		{
			alert("Failed to create logger!\n" + exception.stack);
			return;
		}
		
		//Run state
		this.suspended = false;
		//TODO: Pause - another bool or switch to an "enum"?
		
		//Get window
		this.window = $("#glCanvas");

		//Named callback arrays for communication inside and outside of the game
		this.events = { };
		
		//Initialise renderer
		this.renderer = new Renderer(this);
		
		//Initialise physics
		this.physics = new Physics(this);
	
		//Initialise input
		this.input = new Input(this);
		
		//Set up suspended and unsuspended events
		this.RegisterEventListener("Suspended", function(game, args) { game.suspended = true; });
		this.RegisterEventListener("Unsuspended", function(game, args) { game.suspended = false; });
		
		//Initialise objects
		this.objects = [ ];

		//List of loaded classes, from code or json
		this.classes = { };
	}
	catch(exception)
	{
		this.logger.error(exception.stack);
	}
};


//Run game
Game.prototype.Run = function()
{
	//Main update loop
	var UpdateLoop = function()
	{
		//Constant tick time
		const deltaTime = 1 / 30;
		const deltaTimeMs = 1000 * deltaTime;
		
		//Schedule next tick immediately
		//TODO: Throttle if ticks overlap
		setTimeout(UpdateLoop, deltaTimeMs);
		
		//Catch any runtime exceptions without crashing the game
		try
		{
			//Update
			this.Update(deltaTime, this.suspended ? "UpdateSuspended" : "Update");
		}
		catch(exception)
		{
			this.logger.error(exception.stack);
		}
	}.bind(this);
	
	//Begin the update loop
	UpdateLoop();
}


//Perform one game logic update
Game.prototype.Update = function(deltaTime, updateType)
{
	//Update physics
	this.physics.Update(deltaTime);
	
	//Update input
	this.input.Update(deltaTime);
	
	//Update all game objects
	for(i in this.objects)
	{
		if(this.objects[i])
		{
			this.objects[i][updateType](deltaTime);
		}
	}

	//Clean up null objects
	for(var i = 0; i < this.objects.length; ++i)
	{
		if(!this.objects[i])
		{
			this.objects.splice(i, 1);
			--i;
		}
	}
	
	//Render
	this.renderer.Draw();
}


//Loads a class from json
//TODO: Handle failure to load?
Game.prototype.LoadClassForLevel = function(className, loadingData)
{
	$.getJSON("Objects/" + className + ".json", {}, function(data, json)
	{
		//Create class constructor
		this.classes[className] = function(game, properties)
		{
			//Copy properties
			this.properties = json.properties;

			//Load properties etc
			GameObject.call(this, game, properties);

			//Add components
			for(var name in json.components)
			{
				this.AddComponent(json.components[name], name);
			}
		};

		//Inherit from GameObject
		this.classes[className].prototype = Object.create(GameObject.prototype);
		this.classes[className].prototype.constructor = this.classes[className];

		//Reduce class loading counter
		--loadingData.numClassesLeftToLoad;

		//Classes finished - load the level
		if(loadingData.numClassesLeftToLoad == 0)
		{
			this.LoadLevelCallback(data);
		}
	}.bind(this, loadingData));
}


//Load a level from json
//TODO: Catch exceptions. Log errors.
Game.prototype.LoadLevel = function(file, callback)
{
	$.getJSON(file, {}, function(json)
	{
		//Find classes
		var classesToLoad = [ ];
		for(var i = 0; i < json.length; ++i)
		{
			var objectData = json[i];
			if(!(objectData.type in this.classes))
			{
				if(objectData.type in window)
				{
					//Hard coded classes
					this.classes[objectData.type] = window[objectData.type];
				}
				else
				{
					//Json classes
					classesToLoad.push(objectData.type);
				}
			}
		}

		//Create level loading data
		var loadingData = {
			objects: json,
			numClassesLeftToLoad: classesToLoad.length,
			callback: callback
		};
		
		if(loadingData.numClassesLeftToLoad > 0)
		{
			//Load json classes first
			for(var i = 0; i < classesToLoad.length; ++i)
			{
				var className = classesToLoad[i];
				this.LoadClassForLevel(className, loadingData);
			}
		}
		else
		{
			//Load level directly
			this.LoadLevelCallback(loadingData);
		}
	}.bind(this));
}


//Loads a level from already-loaded json data, with the classes guaranteed to be loaded
//TODO: Catch exceptions. Log errors.
Game.prototype.LoadLevelCallback = function(data)
{
	//Load objects
	for(var i = 0; i < data.objects.length; ++i)
	{
		var objectData = data.objects[i];
		this.objects.push(new this.classes[objectData.type](this, objectData));
	}

	//Run callback
	data.callback();
}


//Remove an object from the game
Game.prototype.RemoveObject = function(object)
{
	for(var i = 0; i < this.objects.length; ++i)
	{
		if(this.objects[i] == object)
		{
			this.objects[i].Destroy();
			this.objects[i] = null;
			return;
		}
	}
}


//Call all callbacks for the named event
Game.prototype.BroadcastEvent = function(eventName)
{
	//Check the event exists
	if(!(eventName in this.events))
	{
		this.logger.log("Event " + eventName + " has no listeners.");
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
