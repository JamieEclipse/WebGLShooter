//Handles loading or otherwise generating a webGL texture
"use strict"


var debugTextureLoadDelay = 0;


function Texture(gl, url)
{
	//Create the texture handle
	this.texture = gl.createTexture();
	
	//Always write test texture
	{
		var width = 2;
		var height = 2;
		const pixels = new Uint8Array([
			255, 0, 255, 255,
			0, 0, 255, 255,
			0, 0, 255, 255,
			255, 0, 255, 255]);
		this.Write(gl, pixels, width, height);
	}
	
	//Load image, where specified
	if(url !== undefined)
	{
		//Load texture
		this.image = new Image();
		
		//Bind loaded callback
		this.image.onload = this.OnLoad.bind(this, gl);
		
		//
		setTimeout(function(t) { t.image.src = url; }, debugTextureLoadDelay, this);
	}
	
};


Texture.prototype.OnLoad = function(gl)
{
	//Bind
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	
	//Write image to texture
	const level = 0;
	const internalFormat = gl.RGBA;
	const sourceFormat = gl.RGBA;
	const sourceType = gl.UNSIGNED_BYTE;
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, sourceFormat, sourceType, this.image);
	
	//TODO: Generate mipmaps where appropriate, then set appropriate min/mag parameters
	gl.generateMipmap(gl.TEXTURE_2D);
	
	//Set up parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	
	//Unbind
	gl.bindTexture(gl.TEXTURE_2D, null);
}


Texture.prototype.Write = function(gl, pixels, width, height)
{
	//Bind
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	
	const level = 0;
	const internalFormat = gl.RGBA;
	const border = 0;
	const sourceFormat = gl.RGBA;
	const sourceType = gl.UNSIGNED_BYTE;
	
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, sourceFormat, sourceType, pixels);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		
	
	//Unbind
	gl.bindTexture(gl.TEXTURE_2D, null);
}