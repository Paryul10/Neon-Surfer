var c;
var c1;
var player;
var coin;
var police;
var dog;
var train = new Array();
var track1 = new Array();
var track2 = new Array();
var track3 = new Array();
var coins = new Array();
var wall = new Array();
var city = new Array();
var boots = new Array();
var small_obs = new Array();
var fly_boots = new Array();
var boxes = new Array();
var obstacle1 = new Array();
var bonus_box = new Array();
var open_obs = new Array();
var city_texture;
var bonus_texture;
var track_texture;
var wall_texture;
var coin_texture;
var fb_texture;
var box_texture;
var obs1_texture;
var train_texture;
var obs1_stand_texture;
var smallobs_texture;
var boot_texture;
var openobs_texture;
var police_texture;
var dog_texture;
var cam_x, cam_y = 2, cam_z = 10.0;     // follow cam
var target_x = 0, target_y = -1, target_z = cam_z - 10;
var greyscale = 0;
var blink_start_time = 0;
var theme = 2;
var back_r = 0;
var back_g = 0;
var back_b = 0;
var obs1_stand_1 = new Array();
var obs1_stand_2 = new Array();
var open_stand_1 = new Array();
var open_stand_2 = new Array();
var theme_flag = 0;
var player_duck = 0;
var coins_collected = 0;
var was_flying = 0;
var false_flag = false;
var score = 0;
var dead = false;
var prime_boost = 233;
var prime_box = 103;
var prime_smallobs = 61;
var prime_obs1 = 73;
var prime_open = 89;
var prime_boots = 127;
var jumping = false, ducking = false;
var jumping_height = 1.5;
var gotBoots, gotFB;
var which_obs = -1, policeCatch, obstacleHit;
var player_init_speed = 0.5;

main();

function callDead() {
  dead = true;
  // $("#canvasDiv").html("<h1>Game Over</h1>");
  document.getElementById('music').pause();
  document.getElementById('crash').play();
}

function main() {
  document.getElementById('music').play();

  d = new Date();
  blink_start_time = d.getTime() * 0.001;
  policeCatch = blink_start_time;

  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // initialse 
  for (var i = 0; i < 100; i += 1) {
    wall.push(new Wall(gl, [0, 0, -i * 5]));
    track1.push(new Track(gl, [-6, 0, -i * 10]));
    track2.push(new Track(gl, [0, 0, -i * 10]));
    track3.push(new Track(gl, [6, 0, -i * 10]));
    city.push(new City(gl, [0, 5, -i * 10]));
  }
  player = new Player(gl, [0, -4, -4]);
  player.speedz = player_init_speed;

  for (var i = 0; i < 50; i++) {
    var x, y, z;
    var rand = Math.floor(Math.random() * 3);
    y = Math.floor(Math.random() * 4) - 4;
    if (rand == 0)
      x = -6;
    else if (rand == 1)
      x = 0;
    else
      x = 6;
    if (i == 0)
      z = -30;
    else
      z = coins[coins.length - 1].pos[2] - (Math.random() * 30 + 15);
    var num_coins = Math.floor(Math.random() * 5 + 5);
    for (var k = 0; k < num_coins; k++) {
      coins.push(new Coin(gl, [x, y, z]));
      z -= 2.5;
    }
  }

  // flying boost
  for (var i = 0; i < 5; i += 1) {
    var x, y, z;
    var rand = Math.floor(Math.random() * 3);
    if (rand == 1)
      x = 0;
    else if (rand == 0)
      x = 6;
    else
      x = -6;
    y = Math.floor(Math.random() * 4) - 1;
    z = - (i + 1) * prime_boost;
    fly_boots.push(new Fb(gl, [x, y, z]));
  }

  // boxes
  for (var i = 0; i < 10; i++) {
    var x, y, z;
    var lane = Math.floor(Math.random() * 3);
    if (lane == 1)
      x = -6;
    else if (lane == 0)
      x = 0;
    else
      x = 6;
    y = -2.5;
    z = - (i + 1) * prime_box;

    boxes.push(new Cube(gl, [x, y, z], 5, 5, 6));
  }

  // jumping obstacle
  for (var i = 0; i < 10; i += 1) {
    var x, y, z;
    var rand = Math.floor(Math.random() * 3);
    if (rand == 1)
      x = 0;
    else if (rand == 0)
      x = 6;
    else
      x = -6;
    // y = Math.floor(Math.random() * 4) - 1;
    y = -3;
    z = - (i + 1) * prime_smallobs;
    small_obs.push(new Smallobs(gl, [x, y, z], 3, 3, 0.1));
  }

  //ducking obs
  for (var i = 0; i < 10; i++) {
    var lane = Math.floor(Math.random() * 3);
    var x, y, z;
    y = -1;
    z = -((i + 1) * prime_obs1);
    if (lane == 1)
      x = -6;
    else if (lane == 0)
      x = 6;
    else
      x = 0;
    obs1_stand_1.push(new Obs1_stand(gl, [x + 2, y - 2, z], 6, 0.2, 0.1));
    obstacle1.push(new Obs1(gl, [x, y, z], 5, 4, 0.1));
    obs1_stand_2.push(new Obs1_stand(gl, [x - 2, y - 2, z], 6, 0.2, 0.1));
  }

  // jumping and ducking obstacle
  for (var i = 0; i < 10; i += 1) {
    var x, y, z;
    var rand = Math.floor(Math.random() * 3);
    if (rand == 1)
      x = 0;
    else if (rand == 0)
      x = 6;
    else
      x = -6;
    // y = Math.floor(Math.random() * 4) - 1;
    y = -3;
    z = - (i + 1) * prime_open;
    open_obs.push(new Smallobs(gl, [x, y, z], 1, 3, 0.1));
    open_stand_1.push(new Obs1_stand(gl, [x + 1.3, y - 1.5, z], 2, 0.4, 0.1));
    open_stand_2.push(new Obs1_stand(gl, [x - 1.3, y - 1.5, z], 2, 0.4, 0.1));
  }

  police = new Police(gl, [0, -4, 0]);
  police.speedz = player_init_speed;
  dog = new Dog(gl, [2, -4, -5]);


  // trains
  for (var i = 0; i < 10; i++) {
    var jug = Math.floor(Math.random() * 2);
    // var type = 0;
    if (jug <= 1.5) {
      type = 1;
    }
    else {
      type = 0; // fast trains
    }
    var lane = Math.floor(Math.random() * 3);
    var x, y, z;
    z = - (i + 1) * 113;
    if (lane == 0)
      x = -6;
    else if (lane == 1)
      x = 6;
    else
      x = 0;
    y = -2;
    wid = Math.floor(Math.random() * 20) + 20;   // 0 - 20 + 10 = 10-30
    train.push(new Train(gl, [x, y, z], 6, 3, wid, type));
  }

  for (var i = 0; i < 10; i += 1) {
    var x, y, z;
    var rand = Math.floor(Math.random() * 3);
    if (rand == 1)
      x = 0;
    else if (rand == 0)
      x = 6;
    else
      x = -6;
    y = Math.floor(Math.random() * 4) - 1;
    z = - (i + 1) * prime_boots;
    boots.push(new Boot(gl, [x, y, z]));
  }



  bonus_box.push(new Bonus(gl, [6, 2, -120]));
  bonus_box.push(new Bonus(gl, [0, 0, -140]));
  bonus_box.push(new Bonus(gl, [-6, 1, -160]));

  bonus_box.push(new Bonus(gl, [0, -2, -400]));
  bonus_box.push(new Bonus(gl, [-6, 0, -700]));


  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;

  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;

    // Apply lighting effect

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
  }
`;

  const vsSourcehigh = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;

  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;

  // Apply lighting effect

  highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
  highp vec3 directionalLightColor = vec3(1, 1, 1);
  highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 1.0);
  vLighting = ambientLight + (directionalLightColor * directional);
}
`;

  const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;

  const fsSourcebw = `
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  uniform sampler2D uSampler;

  void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    gl_FragColor = vec4(texelColor.rrr * vLighting, texelColor.a);
  }
`;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const shaderProgrambw = initShaderProgram(gl, vsSource, fsSourcebw);
  const shaderProgramhigh = initShaderProgram(gl, vsSourcehigh, fsSource);

  if (theme == 1) {
    track_texture = loadTexture(gl, 't2.jpeg');
    wall_texture = loadTexture(gl, 'tex3.jpeg');
    player_texture = loadTexture(gl, 'play2.jpg');
    coin_texture = loadTexture(gl, 'coin2.jpg');
    fb_texture = loadTexture(gl, 'bottle.jpeg');
    box_texture = loadTexture(gl, 'box1.png');
    obs1_texture = loadTexture(gl, 'obs1.jpg');
    obs1_stand_texture = loadTexture(gl, 'stand1.jpg');
    train_texture = loadTexture(gl, 'neon_train.jpg');
    boot_texture = loadTexture(gl, 'joota.jpeg');
    bonus_texture = loadTexture(gl, 'bonus.jpg');
    smallobs_texture = loadTexture(gl, 'neon_small.jpg');
    openobs_texture = loadTexture(gl, 'neon_small.jpg');
    police_texture = loadTexture(gl, 'stand1.jpg');
    dog_texture = loadTexture(gl, 'stand1.jpg');
    back_r = 0;
    back_g = 0 / 256;
    back_b = 0 / 256;
  }

  if (theme == 2) {

    track_texture = loadTexture(gl, 'track2.jpg');
    city_texture = loadTexture(gl, 'city.jpg');
    player_texture = loadTexture(gl, 'play4.jpeg');
    coin_texture = loadTexture(gl, 'coin.jpg');
    fb_texture = loadTexture(gl, 'jp1.jpg');
    box_texture = loadTexture(gl, 'box2.png');
    obs1_texture = loadTexture(gl, 'obs2.jpg');
    obs1_stand_texture = loadTexture(gl, 'stand2.jpg');
    train_texture = loadTexture(gl, 'wagon.jpg');
    boot_texture = loadTexture(gl, 'boot2.jpg');
    bonus_texture = loadTexture(gl, 'bonus.jpg');
    dog_texture = loadTexture(gl, 'stand1.jpg');
    smallobs_texture = loadTexture(gl, 'small.jpg');
    openobs_texture = loadTexture(gl, 'small.jpg');
    police_texture = loadTexture(gl, 'stand1.jpg');
    back_r = 144 / 256;
    back_g = 228 / 256;
    back_b = 252 / 256;
  }

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  const programInfobw = {
    program: shaderProgrambw,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgrambw, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgrambw, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgrambw, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgrambw, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgrambw, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgrambw, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgrambw, 'uSampler'),
    },
  };

  const programInfohigh = {
    program: shaderProgramhigh,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgramhigh, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgramhigh, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgramhigh, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgramhigh, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgramhigh, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgramhigh, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgramhigh, 'uSampler'),
    },
  };

  var then = 0;


  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    if (was_flying == 1) {
      cam_z = player.pos[2] + 14;
      was_flying = 0;
      cam_y = 2;

    }


    player.pos[2] -= player.speedz;
    cam_z -= player.speedz;
    d = new Date();
    t = d.getTime() * 0.001;
    if (t - policeCatch <= 10 && t - policeCatch >= 5)
      police.speedz = player_init_speed / 2;
    else
      police.speedz = player_init_speed;

    if (player.pos[0] > 6)
      player.pos[0] = 6;
    if (player.pos[0] < -6)
      player.pos[0] = -6;

    police.pos[0] = player.pos[0];
    dog.pos[0] = player.pos[0] + 2;

    if (greyscale == 0) {
      if (theme == 1) {
        // logic for blinking
        var d1 = new Date();
        var curr = d1.getTime() * 0.001;
        if (Math.floor((curr - blink_start_time)) % 2 == 0) {
          // console.log("Dark");
          drawScene(gl, programInfo, deltaTime);
        }
        else {
          // console.log("Bright");
          drawScene(gl, programInfohigh, deltaTime);
        }
      }
      else {
        drawScene(gl, programInfo, deltaTime);
      }
    }
    else {
      drawScene(gl, programInfobw, deltaTime);
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function drawScene(gl, programInfo, deltaTime) {
  if (theme_flag == 1) {
    if (theme == 1) {
      track_texture = loadTexture(gl, 't2.jpeg');
      wall_texture = loadTexture(gl, 'tex3.jpeg');
      player_texture = loadTexture(gl, 'play2.jpg');
      coin_texture = loadTexture(gl, 'coin2.jpg');
      fb_texture = loadTexture(gl, 'bottle.jpeg');
      box_texture = loadTexture(gl, 'box1.png');
      obs1_texture = loadTexture(gl, 'obs1.jpg');
      obs1_stand_texture = loadTexture(gl, 'stand1.jpg');
      train_texture = loadTexture(gl, 'neon_train.jpg');
      // boot_texture = loadTexture(gl, 'boot2.jpg');
      boot_texture = loadTexture(gl, 'joota.jpeg');
      bonus_texture = loadTexture(gl, 'bonus.jpg');
      smallobs_texture = loadTexture(gl, 'neon_small.jpg');
      openobs_texture = loadTexture(gl, 'neon_small.jpg');
      dog_texture = loadTexture(gl, 'stand1.jpg');
      police_texture = loadTexture(gl, 'stand1.jpg');
      back_r = 0;
      back_g = 0 / 256;
      back_b = 0 / 256;

    }
    if (theme == 2) {
      track_texture = loadTexture(gl, 'track2.jpg');
      city_texture = loadTexture(gl, 'city.jpg');
      player_texture = loadTexture(gl, 'play4.jpeg');
      coin_texture = loadTexture(gl, 'coin.jpg');
      fb_texture = loadTexture(gl, 'jp1.jpg');
      box_texture = loadTexture(gl, 'box2.png');
      obs1_texture = loadTexture(gl, 'obs2.jpg');
      obs1_stand_texture = loadTexture(gl, 'stand2.jpg');
      train_texture = loadTexture(gl, 'wagon.jpg');
      boot_texture = loadTexture(gl, 'boot2.jpg');
      bonus_texture = loadTexture(gl, 'bonus.jpg');
      smallobs_texture = loadTexture(gl, 'small.jpg');
      openobs_texture = loadTexture(gl, 'small.jpg');
      dog_texture = loadTexture(gl, 'stand1.jpg');
      police_texture = loadTexture(gl, 'stand1.jpg');
      back_r = 144 / 256;
      back_g = 228 / 256;
      back_b = 252 / 256;
    }
    theme_flag = 0;
  }

  if (greyscale == 1) {
    back_r = 100;
    back_g = 100;
    back_b = 100;
  }
  else {
    if (theme == 1) {
      back_r = 0;
      back_g = 0 / 256;
      back_b = 0 / 256;
    }
    else {
      back_r = 144 / 256;
      back_g = 228 / 256;
      back_b = 252 / 256;
    }
  }

  gl.clearColor(back_r, back_g, back_b, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar);

  var cameraMatrix = mat4.create();
  mat4.translate(cameraMatrix, cameraMatrix, [0, cam_y, cam_z]);
  var cameraPosition = [
    cameraMatrix[12],
    cameraMatrix[13],
    cameraMatrix[14],
  ];
  var up = [0, 1, 0];

  mat4.lookAt(cameraMatrix, cameraPosition, [target_x, target_y, cam_z - 10], up);
  var viewMatrix = cameraMatrix;
  var viewProjectionMatrix = mat4.create();
  mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);


  //// Updating values

  var dt = new Date();
  if (player.boots == true) {
    if (dt.getTime() * 0.001 - gotBoots >= 10) {
      jumping_height = 1.5;
      jumping = false;
      player.boots = false;
    }
  }

  if (player.flying_boost == true) {
    if (dt.getTime() * 0.001 - gotFB >= 10) {
      player.flying_boost = false;
      player.pos[1] = -4;
      dog.pos[2] = player.pos[2] + 1;
      cam_y = 2;
      target_y = 0;
      jumping = false;
    }
  }

  if (which_obs != -1) {
    if (dt.getTime() * 0.001 - obstacleHit >= 10) {
      which_obs = -1;
      player.speedz = player_init_speed;
      policeCatch = dt.getTime() * 0.001;
    }
  }

  if (player.pos[2] <= -800) {
    callDead();
    alert("YOU WON\nScore: " + score + "\nCoins: " + coins_collected);
  }

  for (var i = 0; i < train.length; i += 1) {
    if (Math.abs(train[i].pos[2] - player.pos[2]) < 100) {
      train[i].pos[2] += train[i].speedz;
    }
  }


  for (var i = 0; i < boots.length; i += 1) {
    // var delta;
    var rand = Math.floor(Math.random() * 2);  // 0 , 1 ,2
    if (rand == 0) {
      boots[i].pos[1] += 0.1;
    }
    if (rand == 1) {
      boots[i].pos[1] -= 0.1;
    }
    // if(boots[i].pos) 
  }

  // console.log('out', player.pos[1], jumping);
  if (player.flying_boost == false) {
    if (jumping == true) {
      player.pos[1] += player.speedy;
      player.speedy -= 0.01;
      if (player.pos[1] >= jumping_height) {
        player.pos[1] = jumping_height;
        jumping = false;
        player.speedy = 0.05;
      }
    }
    if (jumping == false) {
      // console.log(player.pos[1]);
      if (player.pos[1] > -4) {
        player.speedy += 0.02;
        player.pos[1] -= player.speedy;
        if (player.pos[1] < -4) {
          if (ducking == false) {
            // console.log('fbeiwuqvo', player.pos[1]);

            player.pos[1] = -4;
            player.speedy = 0;
          }
        }
      }
    }
    if (ducking == true) {
      player.pos[1] -= player.speedy;
      if (player.pos[1] <= -5) {
        ducking = false;
        player.speedy = 0.05;
      }
    }
    if (ducking == false) {
      if (player.pos[1] < -4) {
        player.pos[1] += player.speedy;
        if (player.pos[1] > -4) {
          if (jumping == false) {
            player.pos[1] = -4;
            player.speedy = 0.05;
          }
        }
      }
    }
  }

  police.pos[0] = player.pos[0];
  police.pos[1] = player.pos[1];
  police.pos[2] -= police.speedz;

  dog.pos[0] = player.pos[0] + 2;
  dog.pos[1] = -4;
  if (player.flying_boost == false)
    dog.pos[2] = player.pos[2] + 1;
  else
    dog.pos[2] -= player.speedz;

  console.log(dog.pos[2]);

  //////// Checking Collisons


  for (var i = 0; i < boxes.length; i++) {
    if (player.pos[0] == boxes[i].pos[0]) {
      if (player.pos[1] >= boxes[i].pos[1] - 3.5 && player.pos[1] <= boxes[i].pos[1] + 2.5) {
        if (player.pos[2] <= boxes[i].pos[2] + 3.5 && player.pos[2] >= boxes[i].pos[2] - 3.5) {
          alert("YOU LOST\nScore: " + score + "\nCoins: " + coins_collected);
          // callDead();
        }
      }
    }
  }


  for (var i = 0; i < train.length; i++) {
    if (player.pos[0] == train[i].pos[0]) {
      if (player.pos[1] <= train[i].pos[1] + 6 && player.pos[1] >= train[i].pos[1] + 5.8) {
        if (player.pos[2] <= train[i].pos[2] + train[i].width / 2 + 1 && player.pos[2] >= train[i].pos[2] - train[i].width / 2 - 1) {
          player.pos[1] = train[i].pos[1] + 6;
          break;
        }
      }
    }
  }

  for (var i = 0; i < train.length; i += 1) {
    if (player.pos[0] == train[i].pos[0]) {
      if (player.pos[1] >= train[i].pos[1] - 3 && player.pos[1] <= train[i].pos[1] + 3) {
        if (player.pos[2] <= (train[i].pos[2] + train[i].width / 2) && player.pos[2] >= (train[i].pos[2] - train[i].width / 2)) {
          callDead();
          alert("YOU LOST\nScore: " + score + "\nCoins: " + coins_collected);
        }
      }
    }
  }


  for (var i = 0; i < small_obs.length; i += 1) {
    if (player.pos[0] == small_obs[i].pos[0]) {
      if (player.pos[1] >= small_obs[i].pos[1] - 2.5 && player.pos[1] <= small_obs[i].pos[1] + 2.5) {
        // console.log("Y mathces")
        if (player.pos[2] >= small_obs[i].pos[2] - 1.2 && player.pos[2] <= small_obs[i].pos[2] + 1.2) {
          // console.log("z also matches")
          callDead();
          alert("YOU LOST\nScore: " + score + "\nCoins: " + coins_collected);
        }
      }
    }
  }


  for (var i = 0; i < coins.length; i++) {
    if (coins[i].exist == 1) {
      if (coins[i].pos[0] == player.pos[0]) {
        if (coins[i].pos[1] >= player.pos[1] - 1.5 && coins[i].pos[1] <= player.pos[1] + 1.5) {
          if (coins[i].pos[2] >= player.pos[2] - 1.5 && coins[i].pos[2] <= player.pos[2] + 1.5) {
            coins[i].exist = 0;
            coins_collected += 1;
          }
        }
      }
    }
  }

  for (var i = 0; i < fly_boots.length; i += 1) {
    if (fly_boots[i].exist == 1) {
      if (fly_boots[i].pos[0] == player.pos[0]) {
        if (player.pos[1] >= fly_boots[i].pos[1] - 1.75 && player.pos[1] <= fly_boots[i].pos[1] + 1.75) {
          if (player.pos[2] >= fly_boots[i].pos[2] - 1.75 && player.pos[2] <= fly_boots[i].pos[2] + 1.75) {
            fly_boots[i].exist = 0;
            player.flying_boost = true;
            var d = new Date();
            gotFB = d.getTime() * 0.001;
            player.pos[1] = 10;
            cam_y = player.pos[1] + 6;
            target_y = player.pos[1] + 3;
            jumping = false;
            dog.pos[2] = player.pos[2] - 15;
            console.log(dog.pos[2]);
          }
        }
      }
    }
  }


  for (var i = 0; i < boots.length; i += 1) {
    if (boots[i].exist == 1) {
      if (boots[i].pos[0] == player.pos[0]) {
        if (player.pos[1] >= boots[i].pos[1] - 1.75 && player.pos[1] <= boots[i].pos[1] + 1.75) {
          if (player.pos[2] >= boots[i].pos[2] - 1.75 && player.pos[2] <= boots[i].pos[2] + 1.75) {
            // console.log("Collision with boots")
            boots[i].exist = 0;
            jumping_height = 3;
            player.boots = true;
            var d = new Date();
            gotBoots = d.getTime() * 0.001;
            jumping = false;
          }
        }
      }
    }
  }


  for (var i = 0; i < bonus_box.length; i += 1) {
    if (bonus_box[i].exist == 1) {
      if (bonus_box[i].pos[0] == player.pos[0]) {
        if (player.pos[1] >= bonus_box[i].pos[1] - 1.75 && player.pos[1] <= bonus_box[i].pos[1] + 1.75) {
          if (player.pos[2] >= bonus_box[i].pos[2] - 1.75 && player.pos[2] <= bonus_box[i].pos[2] + 1.75) {
            // console.log("Collision with bonus_box")
            bonus_box[i].exist = 0;
            coins_collected += 100;
          }
        }
      }
    }
  }

  // light 
  for (var i = 0; i < open_obs.length; i += 1) {
    if (open_obs[i].ishit == 0)
      if (open_obs[i].pos[0] == player.pos[0]) {
        if (player.pos[1] >= open_obs[i].pos[1] - 1 && player.pos[1] <= open_obs[i].pos[1] + 3) {
          if (player.pos[2] >= open_obs[i].pos[2] - 1.2 && player.pos[2] <= open_obs[i].pos[2] + 1.2) {
            // player.speedz = player.speedz / 2;
            open_obs[i].ishit = 1;
            d = new Date();
            t = d.getTime() * 0.001;
            if (t - policeCatch <= 10) {
              callDead();
              alert("YOU LOST\nCoins: " + coins_collected);
            }
            else {
              which_obs = i;
              player.speedz = player_init_speed / 2;
              policeCatch = obstacleHit = t;
            }
          }
        }
      }
  }

  for (var i = 0; i < boxes.length; i++) {
    if (player.pos[0] == boxes[i].pos[0]) {
      if (player.pos[1] <= boxes[i].pos[1] + 3.5) {
        if (player.pos[2] <= boxes[i].pos[2] + 3.5 && player.pos[2] >= boxes[i].pos[2] - 3.5) {
          player.pos[1] = boxes[i].pos[1] + 3.5;
          break;
        }
      }
    }
  }



  // light
  for (var i = 0; i < obstacle1.length; i++) {
    if (obstacle1[i].ishit == 0) {
      if (player.pos[0] == obstacle1[i].pos[0]) {
        if (player.pos[1] >= obstacle1[i].pos[1] - 3.5 && player.pos[1] <= obstacle1[i].pos[1] + 3.5) {
          // console.log("into")
          if (obstacle1[i].pos[2] >= player.pos[2] - 1.1 && obstacle1[i].pos[2] <= player.pos[2] + 1.1) {
            obstacle1[i].ishit = 1;
            // player.speedz = player.speedz / 2;
            // console.log("Hit")
            d = new Date();
            t = d.getTime() * 0.001;
            if (t - policeCatch <= 10) {
              callDead();
              alert("YOU LOST\nCoins: " + coins_collected);
            }
            else {
              which_obs = i;
              player.speedz = player_init_speed / 2;
              policeCatch = obstacleHit = t;
            }
          }
        }
      }
    }
  }


  ////// DRAW EVERYTHING.
  for (var i = 0; i < 100; i += 1) {
    track1[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    track2[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    track3[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    if (theme == 1) {
      wall[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    if (theme == 2) {
      city[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
  }
  player.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);


  for (var i = 0; i < 5; i += 1) {
    if (fly_boots[i].exist == 1) {
      fly_boots[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
  }

  for (var i = 0; i < 5; i += 1) {
    if (boots[i].exist == 1) {
      boots[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
  }

  for (var i = 0; i < boxes.length; i++) {
    boxes[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  }
  for (var i = 0; i < coins.length; i++) {
    if (coins[i].exist == 1)
      coins[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  }
  for (var i = 0; i < obstacle1.length; i++) {
    obs1_stand_1[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    obs1_stand_2[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    obstacle1[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  }

  for (var i = 0; i < small_obs.length; i++) {
    if (small_obs[i].exist == 1)
      small_obs[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  }

  for (var i = 0; i < open_obs.length; i++) {
    if (open_obs[i].exist == 1) {
      open_obs[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
      open_stand_1[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
      open_stand_2[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
  }

  for (var i = 0; i < train.length; i += 1) {
    train[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  }

  for (var i = 0; i < bonus_box.length; i += 1) {
    if (bonus_box[i].exist == 1) {
      bonus_box[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
  }

  dog.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  police.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);


}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 255, 255, 255]);  // opaque blue

  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
    width, height, border, srcFormat, srcType,
    pixel);

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
      srcFormat, srcType, image);

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;
  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

