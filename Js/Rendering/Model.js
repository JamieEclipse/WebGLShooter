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
		$.get(data, {}, function(fileName, contents)
		{
			var extension = fileName.split(".").pop();
			switch(extension)
			{
				case "json":
				this.LoadJson(contents);
				break;
				
				case "obj":
				this.LoadObj(contents);
				break;
			}

			//Apply scale
			if(this.scale != 1)
			{
				for(var i in this.positions)
				{
					this.positions[i] *= this.scale;
				}
			}

			//Write initial values to buffers
			this.WriteToBuffers(this.gl);

			//Call callbacks
			this.loaded = true;
			for(var i in this.loadedCallbacks)
			{
				this.loadedCallbacks[i]();
			}
		}.bind(this, data));
	}
}


Model.prototype.LoadJson = function(data)
{
	//Copy data
	for(var name in data)
	{
		this[name] = data[name];
	}
}


Model.prototype.LoadObj = function(data)
{
	//Initialise member arrays
	this.indices = [];
	this.positions = [];
	this.texCoords = [];
	this.normals = [];

	//Temporary texCoord array - to be translated from separate indices
	var rawIndices = [];
	var rawPositions = [];
	var rawTexCoords = [];
	var rawNormals = [];

	//Read line by line
	var lines = data.split("\n");

	//Load vertices, defer faces
	for(var i in lines)
	{
		//Split into tokens
		var tokens = lines[i].split(/\s/);

		//Comments don't need a space
		if(tokens[0].startsWith("#"))
		{
			continue;
		}
		
		switch(tokens[0])
		{
			case "v":
			rawPositions.push(parseFloat(tokens[1]));
			rawPositions.push(parseFloat(tokens[2]));
			rawPositions.push(parseFloat(tokens[3]));
			break;

			case "vt":
			rawTexCoords.push(1 - parseFloat(tokens[1]));
			rawTexCoords.push(1 - parseFloat(tokens[2]));
			break;

			case "vn":
			rawNormals.push(parseFloat(tokens[1]));
			rawNormals.push(parseFloat(tokens[2]));
			rawNormals.push(parseFloat(tokens[3]));
			break;

			case "f":
			for(var j = tokens.length - 1; j > 0; --j)
			{
				var vert = tokens[j].split("/");
				var indexObject =
				{
					position: parseInt(vert[0]) - 1,
					texCoord: parseInt(vert[1]) - 1,
					normal: parseInt(vert[2]) - 1
				};
				
				rawIndices.push(indexObject);
			}
			break;
		}
	}

	//Build arrays
	//TODO: Remove duplicates
	for(var i = 0; i < rawIndices.length; ++i)
	{
		var index = rawIndices[i];
		
		//Add index
		this.indices.push(i);

		//Add position
		this.positions.push(rawPositions[index.position * 3 + 0]);
		this.positions.push(rawPositions[index.position * 3 + 1]);
		this.positions.push(rawPositions[index.position * 3 + 2]);

		//Add texCoord
		this.texCoords.push(rawTexCoords[index.texCoord * 2 + 0]);
		this.texCoords.push(rawTexCoords[index.texCoord * 2 + 1]);

		//Add normal
		this.normals.push(rawNormals[index.normal * 3 + 0]);
		this.normals.push(rawNormals[index.normal * 3 + 1]);
		this.normals.push(rawNormals[index.normal * 3 + 2]);
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
