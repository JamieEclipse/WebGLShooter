//Handles loading or generation of models
"use strict"


function Model(gl, data, scale = 1)
{
	//Store reference to GL context
	this.gl = gl;

	//Create buffers
	this.positionBuffer = gl.createBuffer();
	this.texCoordBuffer = gl.createBuffer();
	this.indexBuffer = gl.createBuffer();
	
	//Loaded flag and callbacks
	this.loaded = false;
	this.loadedCallbacks = [ ];

	//Store scale
	this.scale = scale;
	
	if(data === undefined)
	{
		var size = 0.5 * this.scale;

		//Set default values to a textured quad
		this.positions = [
			size, size, 0.0,
			-size, size, 0.0,
			size, -size, 0.0,
			-size, -size, 0.0,
		];
		
		this.texCoords = [
			0, 0,
			1, 0,
			0, 1,
			1, 1
		];

		this.indices = [ 0, 1, 2, 2, 1, 3 ];

		//Write initial values to buffers
		this.loaded = true;
		this.WriteToBuffers(gl);
	}
	else
	{
		$.getJSON(data, {}, function(json)
		{
			//Copy data
			for(var name in json)
			{
				this[name] = json[name];
			}

			//Apply scale
			if(this.scale != 1)
			{
				for(var i in json.positions)
				{
					json.positions[i] *= this.scale;
				}
			}

			//Write initial values to buffers
			this.loaded = true;
			this.WriteToBuffers(this.gl);

			//Call callbacks
			for(var i in this.loadedCallbacks)
			{
				this.loadedCallbacks[i]();
			}
		}.bind(this));
	}
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

	//Build this index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

	//Unbind buffers
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}


//Ready the model for drawing by binding to the appropriate shader inputs
Model.prototype.BindForDrawing = function(gl, shader)
{
	//Bind the position buffer
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
	
	//Bind the texture co-ordinate buffer
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

	//Bind the index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
}
