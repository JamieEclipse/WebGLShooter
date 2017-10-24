//Enemy class - handles AI, collisions and movement
"use strict"


function Enemy(game, properties)
{
	this.properties = { };
	this.properties.model = "Models/Billboard.json";
	this.properties.texture = "Images/EyeBall.png";
	this.properties.scale = 2;

	GameObject.call(this, game, properties);

	//Transform
	this.AddComponent("TransformComponent", "transform");
	
	//Models
	this.AddComponent("ModelComponent", "model");

	//Set up collisions
	this.physics = new PhysicsObject(new Sphere(this.transform.position, 1), this);
    game.physics.AddPhysicsObject(this.physics);
    this.physics.OnCollision = this.OnCollision.bind(this);

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


Enemy.prototype.Destroy = function()
{
	this.game.physics.RemovePhysicsObject(this.physics);
}
