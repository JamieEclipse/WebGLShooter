//Handles loading or generation of models
"use strict"


function Model(gl)
{
	//Create buffers
	this.positionBuffer = gl.createBuffer();
	this.texCoordBuffer = gl.createBuffer();
	
	//Set initial values to a textured quad
	this.positions = [
		 0.5, 0.5, 0.0,
		-0.5, 0.5, 0.0,
		 0.5, -0.5, 0.0,
		-0.5, -0.5, 0.0,
	];
	
	this.texCoords = [
		0, 0,
		1, 0,
		0, 1,
		1, 1
	];
	
	//Write initial values to buffers
	this.WriteToBuffers(gl);
}


//Writes the model's local vertex data into its GL buffers
Model.prototype.WriteToBuffers = function(gl)
{
	//Build the position buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
	
	//Build the texCoord buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);
	
	//Unbind
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


//Ready the model for drawing by binding to the appropriate shader inputs
Model.prototype.BindForDrawing = function(gl, shader)
{
	//Bind the vertex buffer
	{
		const numComponents = 3;// pull out 2 values per iteration
		const type = gl.FLOAT;// the data in the buffer is 32bit floats
		const normalize = false;// don't normalize
		const stride = 0; // how many bytes to get from one set of values to the next
		// 0 = use type and numComponents above
		const offset = 0; // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.vertexAttribPointer(
			shader.attributeLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(shader.attributeLocations.vertexPosition);
	}
	
	{
		const numComponents = 2;// pull out 2 values per iteration
		const type = gl.FLOAT;// the data in the buffer is 32bit floats
		const normalize = false;// don't normalize
		const stride = 0; // how many bytes to get from one set of values to the next
		// 0 = use type and numComponents above
		const offset = 0; // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
		gl.vertexAttribPointer(
			shader.attributeLocations.texCoordPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(shader.attributeLocations.texCoordPosition);
	}
}
