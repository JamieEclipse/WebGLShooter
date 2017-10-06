//Obstacle with model
"use strict"


function Wall(game)
{
	GameObject.call(this, game);
	
	//Wall model
	//TODO: Reference a centralised asset
	var scale = 3;
	this.model = new Model(game.renderer.gl, "Models/Cube.json", scale);
	
	//Wall texture
	this.texture = new Texture(game.renderer.gl, "Images/Wall.png");
	
	//Wall shader
	this.shader = new Shader(game.renderer.gl);
	this.shader.textures = [this.texture.texture];

	//Physics
	this.physics = new PhysicsObject(new BoundingBox(this.position, vec3.fromValues(0.5 * scale, 0.5 * scale, 0.5 * scale)));
	game.physics.AddPhysicsObject(this.physics);
};

Wall.prototype = Object.create(GameObject.prototype);
Wall.prototype.constructor = Wall;


Wall.prototype.Draw = function()
{
	var modelMatrix = mat4.create();
	mat4.translate(modelMatrix, modelMatrix, this.position);
	this.game.renderer.DrawModel(this.model, this.shader, modelMatrix);
}
