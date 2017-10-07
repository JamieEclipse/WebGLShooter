//Wrap loading and compiling a gl shader
"use strict"

function Shader(gl)
{
	//Create program handle in gl
	this.program = gl.createProgram();
	
	//Shaders can hold a list of texture handles to bind before being invoked
	this.textures = [];
	
	//Default vertex shader program
	this.vertexShaderSource = `
		attribute vec3 aVertexPosition;
		attribute vec2 aTexCoord;
		uniform mat4 uViewMatrix;
		uniform mat4 uModelMatrix;
		uniform mat4 uProjectionMatrix;
		
		varying vec3 worldPosition;
		varying vec2 textureCoordinate;
		
		void main()
		{
			vec4 worldPosition4 = uModelMatrix * vec4(aVertexPosition, 1.0);
			worldPosition = worldPosition4.xyz;
			gl_Position = uProjectionMatrix * uViewMatrix * worldPosition4;
			textureCoordinate = aTexCoord;
		}
		`;

	//Default fragment shader program
	this.fragmentShaderSource = `
		precision mediump float;
		
		varying vec3 worldPosition;
		varying vec2 textureCoordinate;
		
		uniform sampler2D uTexture;
		
		void main()
		{
			//Sample texure
			gl_FragColor = texture2D(uTexture, textureCoordinate);

			//Apply fog
			float fogAmount = (1.0 - gl_FragCoord.w);
			fogAmount = clamp(fogAmount, 0.0, 1.0);
			vec3 fogColour = vec3(0.01, 0.0, 0.0);
			gl_FragColor.xyz = mix(gl_FragColor.xyz, fogColour, fogAmount);
		}
		`;
		
	this.Init(gl);
}


Shader.prototype.Init = function(gl)
{
	//Create vertex and fragment shaders
	const vertexShader = this.LoadShader(gl, gl.VERTEX_SHADER, this.vertexShaderSource);
	const fragmentShader = this.LoadShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource);
	
	//Bind the shaders to the program
	gl.attachShader(this.program, vertexShader);
	gl.attachShader(this.program, fragmentShader);
	gl.linkProgram(this.program);
	
	// If creating the shader program failed, alert
	if(!gl.getProgramParameter(this.program, gl.LINK_STATUS))
	{
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.program));
		return null;
	}
	
	//Store uniform and attribute locations
	this.attributeLocations = { 
		vertexPosition: gl.getAttribLocation(this.program, 'aVertexPosition'),
		texCoordPosition: gl.getAttribLocation(this.program, 'aTexCoord'),
	};
	
	this.uniformLocations = {
		projectionMatrix: gl.getUniformLocation(this.program, 'uProjectionMatrix'),
		viewMatrix: gl.getUniformLocation(this.program, 'uViewMatrix'),
		modelMatrix: gl.getUniformLocation(this.program, 'uModelMatrix'),
		texture: gl.getUniformLocation(this.program, 'uTexture')
	};
};


//Compiles a shader
Shader.prototype.LoadShader = function(gl, type, source)
{
	const shader = gl.createShader(type);
	
	// Send the source to the shader object
	gl.shaderSource(shader, source);
	
	// Compile the shader program
	gl.compileShader(shader);
	
	// See if it compiled successfully
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	
	return shader;
}


//Binds all textures in "textures"
Shader.prototype.BindTextures = function(gl)
{
	for(i in this.textures)
	{
		gl.activeTexture(gl["TEXTURE" + i]);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
	}
}
