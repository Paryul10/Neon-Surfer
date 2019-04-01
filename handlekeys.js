document.addEventListener(
    "keydown",
    event => {
        code = event.keyCode;
        // console.log(code);
        if (code == 65 || code == 37) {
            player.pos[0] -= 6;
        }
        if (code == 68 || code == 39) {
            player.pos[0] += 6;
        }
        if (code == 87 || code == 38) {
            if (player.pos[1] < -4)
                player.pos[1] = -4;
            jumping = true;
            ducking = false;
            player.speedy = 0.5;
        }

        if (code == 83 || code == 40) {
            if (player.pos[1] != -4)
                player.pos[1] = -4;
            ducking = true;
            jumping = false;
            player.speedy = 0.2;
        }

        if (code == 49) {
            theme = 1;
            theme_flag = 1;
        }
        if (code == 50) {
            theme = 2;
            theme_flag = 1;
        }
        if (code == 71) {
            greyscale += 1;
            greyscale = greyscale % 2;
            console.log(greyscale);
        }
    },
    false
);
