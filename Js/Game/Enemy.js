//Enemy class - handles AI, collisions and movement
"use strict"


function Enemy(game, properties)
{
	this.properties = { };
	this.properties.model = "Models/Billboard.json";
	this.properties.texture = "Images/EyeBall.png";
	this.properties.scale = 2;
	this.properties.physics = [{ shape: "Sphere", radius: 1 }];

	GameObject.call(this, game, properties);

	//Components
	this.AddComponent("TransformComponent", "transform");
	this.AddComponent("ModelComponent", "model");
	this.AddComponent("PhysicsComponent", "physics");

	//Set up collisions
    this.physics.physicsObject.OnCollision = this.OnCollision.bind(this);

	//Health
	this.LoadProperty("health", 3);
};

Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.OnCollision = function(object, intersect)
{
	//Damage the player
	if(object.owner.constructor.name == "Player")
	{
		//TODO: Damage the player!
		this.game.logger.log("Damaged player!");
	}
}


//Take damage from bullets etc
Enemy.prototype.Damage = function(amount)
{
	//Take damage	
	this.health -= amount;

	//Die
	if(this.health <= 0)
	{
		this.game.RemoveObject(this);
	}
}