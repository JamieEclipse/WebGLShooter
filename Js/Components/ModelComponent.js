//Component to render a model with a given shader and texture array
"use strict"


function ModelComponent(gameObject, properties)
{
	Component.call(this, gameObject, properties);

	//TODO: Reference centralised assets

	//Load model
	this.LoadProperty("scale", 1);
	var modelFile = this.GetProperty("model", "Models/Cube.json");
	this.model = new Model(this.game.renderer.gl, modelFile, this.scale);

	//Load texture
	var textureFile = this.GetProperty("texture", "Images/Wall.png");
	this.texture = new Texture(this.game.renderer.gl, textureFile);

	//Load shader
	this.shader = new Shader(this.game.renderer.gl);
	this.shader.textures = [this.texture.texture];
}

ModelComponent.prototype = Object.create(GameObject.prototype);
ModelComponent.prototype.constructor = ModelComponent;


ModelComponent.prototype.Draw = function()
{
	//TODO: Extract transform component name into a property?
	this.game.renderer.DrawModel(this.model, this.shader, this.gameObject.transform.GetTransform());
}