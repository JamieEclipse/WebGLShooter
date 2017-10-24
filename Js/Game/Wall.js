//Obstacle with model
//TODO: Generalise this further then rename it
"use strict"


function Wall(game, properties)
{
	//Default properties
	//TODO: Move this to json
	this.properties = { };
	this.properties.scale = 4;
	this.properties.model = "Models/Cube.json";
	this.properties.texture = "Images/Wall.png";

	GameObject.call(this, game, properties);

	//Transform
	this.transform = new TransformComponent(this, this.properties);
	
	//Wall model
	//TODO: Reference a centralised asset
	this.AddComponent("ModelComponent", "model");

	//Physics
	var scale = this.GetProperty("scale", 1);
	if("physics" in this.properties)
	{
		//Loop through physics data
		for(var i = 0; i < this.properties.physics.length; ++i)
		{
			var physicsData = this.properties.physics[i];
			var shape;

			//Load a shape
			//TODO: Other shapes. Architect this properly.
			switch(physicsData.type)
			{
				case "Plane":
				shape = new Plane(physicsData.normal, physicsData.offset);
				break;
			}

			//Add a physics object
			if(shape !== undefined)
			{
				var physics = new PhysicsObject(shape);
				game.physics.AddPhysicsObject(physics);
			}
		}
	}
	else
	{
		var physics = new PhysicsObject(new BoundingBox(this.transform.position, vec3.fromValues(0.5 * scale, 0.5 * scale, 0.5 * scale)));
		game.physics.AddPhysicsObject(physics);
	}
};

Wall.prototype = Object.create(GameObject.prototype);
Wall.prototype.constructor = Wall;
