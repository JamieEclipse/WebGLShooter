//Renderer
"use strict"

//Constructor
function Renderer(game)
{
	//Store a reference back to the game
	this.game = game;

	//Get the canvas to render to
	this.canvas = game.window[0];
	
	//Resize the canvas
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	
	//Get gl context
	this.gl = this.canvas.getContext("webgl");
	
	//Initialise gl settings
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	
	//Initialise camera
	this.camera = new Camera();
}


//Render a frame
Renderer.prototype.Draw = function()
{
	//Clear to black
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(1.0);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	
	//Draw all game objects
	for(var i in this.game.objects)
	{
		this.game.objects[i].Draw();
	}
}


//Draws a model using the specified shader and model matrix
Renderer.prototype.DrawModel = function(model, shader, modelMatrix)
{
	//Check resources are loaded
	//TODO: Check shader and textures?
	if(!model.loaded)
	{
		return;
	}

	//Prepare matrices
	const projectionMatrix = this.camera.GetProjectionMatrix(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
	const viewMatrix = this.camera.GetViewMatrix();

	//Bind the model
	model.BindForDrawing(this.gl, shader);

	//Bind the shader
	this.gl.useProgram(shader.program);
	
	//Bind the textures
	shader.BindTextures(this.gl);

	//Set the shader uniforms
	this.gl.uniformMatrix4fv(shader.uniformLocations.projectionMatrix, false, projectionMatrix);
	this.gl.uniformMatrix4fv(shader.uniformLocations.viewMatrix, false, viewMatrix);
	this.gl.uniformMatrix4fv(shader.uniformLocations.modelMatrix, false, modelMatrix);

	//Draw call
	const offset = 0;
	this.gl.drawElements(this.gl.TRIANGLES, model.indices.length, this.gl.UNSIGNED_SHORT, offset);
}
