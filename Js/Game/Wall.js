//Obstacle with model
//TODO: Generalise this further then rename it
"use strict"


function Wall(game, properties)
{
	GameObject.call(this, game, properties);

	//Transform
	this.transform = new TransformComponent(this, this.properties);
	
	//Wall model
	//TODO: Reference a centralised asset
	this.LoadProperty("scale", 4);
	var modelFile = this.GetProperty("model", "Models/Cube.json");
	this.model = new Model(game.renderer.gl, modelFile, this.scale);
	
	//Wall texture
	var textureFile = this.GetProperty("texture", "Images/Wall.png");
	this.texture = new Texture(game.renderer.gl, textureFile);
	
	//Wall shader
	this.shader = new Shader(game.renderer.gl);
	this.shader.textures = [this.texture.texture];

	//Physics
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
		var physics = new PhysicsObject(new BoundingBox(this.transform.position, vec3.fromValues(0.5 * this.scale, 0.5 * this.scale, 0.5 * this.scale)));
		game.physics.AddPhysicsObject(physics);
	}
};

Wall.prototype = Object.create(GameObject.prototype);
Wall.prototype.constructor = Wall;


Wall.prototype.Draw = function()
{
	this.game.renderer.DrawModel(this.model, this.shader, this.transform.GetTransform());
}
