//Renderer
"use strict"

//Constructor
function Renderer()
{
	//Get the canvas to render to
	this.canvas = document.querySelector("#glCanvas");
	
	//Resize the canvas
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	
	//Get gl context
	this.gl = this.canvas.getContext("webgl");
	
	//Initialise gl settings
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.depthFunc(this.gl.LEQUAL);
	
	//Initialise camera
	this.camera = new Camera();
}


//Render a frame
Renderer.prototype.Draw = function(game)
{
	//Clear to black
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(1.0);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	
	//Draw all game objects
	for(i in game.objects)
	{
		game.objects[i].Draw(game);
	}
}


//Draws a model using the specified shader and model matrix
Renderer.prototype.DrawModel = function(model, shader, modelMatrix)
{
	//Prepare matrices
	const projectionMatrix = this.camera.GetProjectionMatrix(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
	const viewMatrix = this.camera.GetViewMatrix();

	//Bind the model
	model.BindForDrawing(this.gl, shader);
	
	//Bind the texture to the appropriate slot
	shader.BindTextures(this.gl);

	// Tell WebGL to use our program when drawing
	this.gl.useProgram(shader.program);

	// Set the shader uniforms
	this.gl.uniformMatrix4fv(shader.uniformLocations.projectionMatrix, false, projectionMatrix);
	this.gl.uniformMatrix4fv(shader.uniformLocations.viewMatrix, false, viewMatrix);
	this.gl.uniformMatrix4fv(shader.uniformLocations.modelMatrix, false, modelMatrix);

	{
		const offset = 0;
		const vertexCount = 4;
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}
