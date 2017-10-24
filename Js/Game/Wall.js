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
	this.properties.physics = [{ shape: "BoundingBox", size: [ 2, 2, 2 ] }];

	GameObject.call(this, game, properties);

	//Components
	this.AddComponent("TransformComponent", "transform");
	this.AddComponent("ModelComponent", "model");
	this.AddComponent("PhysicsComponent", "physics");
};

Wall.prototype = Object.create(GameObject.prototype);
Wall.prototype.constructor = Wall;
