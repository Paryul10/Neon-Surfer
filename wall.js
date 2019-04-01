/// <reference path="webgl.d.ts" />

let Wall = class {
    constructor(gl, pos) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        this.positions = [
            // Right face
            -9.0, -5.0, 2.5,
            -9.0, -5.0, -2.5,
            -9.0, 2.0, -2.5,
            -9.0, 2.0, 2.5,
            // Left face
            9.0, -5.0, 2.5,
            9.0, -5.0, -2.5,
            9.0, 2.0, -2.5,
            9.0, 2.0, 2.5,

        ];

        this.rotation = 0.0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);


        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.


        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        this.norm = -1.0;

        var vertexNormals = [
            // // Front
            // 0.0, 0.0, 1.0,
            // 0.0, 0.0, 1.0,
            // 0.0, 0.0, 1.0,
            // 0.0, 0.0, 1.0,

            // // Back
            // 0.0, 0.0, -1.0,
            // 0.0, 0.0, -1.0,
            // 0.0, 0.0, -1.0,
            // 0.0, 0.0, -1.0,

            // // Top
            // 0.0, 1.0, 0.0,
            // 0.0, 1.0, 0.0,
            // 0.0, 1.0, 0.0,
            // 0.0, 1.0, 0.0,

            // // Bottom
            // 0.0, -1.0, 0.0,
            // 0.0, -1.0, 0.0,
            // 0.0, -1.0, 0.0,
            // 0.0, -1.0, 0.0,

            // Right
            this.norm, 0.0, 0.0,
            this.norm, 0.0, 0.0,
            this.norm, 0.0, 0.0,
            this.norm, 0.0, 0.0,

            // Left
            this.norm, 0.0, 0.0,
            this.norm, 0.0, 0.0,
            this.norm, 0.0, 0.0,
            this.norm, 0.0, 0.0

            

        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
            gl.STATIC_DRAW);

        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        const textureCoordinates = [
            // Right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Left
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
            gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        const indices = [
            0, 1, 2, 0, 2, 3, // right
            4, 5, 6, 4, 6, 7, // left
        ];

        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            // color: colorBuffer,
            normal: normalBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        }

    }

    drawCube(gl, projectionMatrix, programInfo, deltaTime) {
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );

        // this.rotation += Math.PI / (((Math.random()) % 100) + 50);
        // this.rotation += 0.01

        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.rotation,
            [1, 0, 0]);

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.textureCoord);
        }


        // Tell WebGL how to pull out the normals from
        // the normal buffer into the vertexNormal attribute.
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.normal);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexNormal,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexNormal);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix);
        // Specify the texture to map onto the faces.

        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, wall_texture);

        // Tell the shader we bound the texture to texture unit 0

        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        {
            const vertexCount = 12;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
};