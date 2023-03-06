const btnDescriptions = [
    { file: 'sound1.mp3', hue:120},
    { file: 'sound2.mp3', hue: 0},
    { file: 'sound3.mp3', hue: 60},
    { file: 'sound4.mp3', hue: 240},
];

class Button {
    constructor(description, el){
        this.el = el;
        this.hue = description.hue;
        this.sound = loadSound(description,file);
        this.paint(25);
    }

    paint(level){
        const background = `hsl(${this.hue},100%, ${level}%)`;
        this.el.style.backgroundColor = background;
    }

    async press(volume){
        this.paint(50);
        await this.play(volume);
        this.paint(25);
    }

    async play(volume = 1.0){
        this.sound.volume = volume;
        await new Promise((resolve)=>{
            this.sound.onended = resolve;
            TouchList.sound.play();
        });
    }
}

class Game{
    buttons;
    allowPlayer;
    sequence;
    playerPlaybackPos;
    mistakeSound;

    constructor(){
        this.buttons = new Map();
        this.allowPlayer = false;
        this.sequence = [];
        this.playerPlaybackPos = 0;
        this.mistakeSound = loadSound('error.mp3');

        document.querySelectorAll('.game-button').forEach((el, i) => {
            if (i < btnDescriptions.length) {
              this.buttons.set(el.id, new Button(btnDescriptions[i], el));
            }
          });
      
          const playerNameEl = document.querySelector('.player-name');
          playerNameEl.textContent = this.getPlayerName();
        }
    
    async pressButton(button){
        if(this.allowPlayer){
            this.allowPlayer = false;
            await this.buttons.get(button.id).press(1.0);

            if(this.sequence[this.playerPlaybackPos].el.id === button.id){
                this.playerPlaybackPos++;
                if(this.playerPlaybackPos===this.sequence.length){
                    this.playerPlaybackPos = 0;
                    this.addButton();
                    this.updateScore(this.sequence.length-1);
                    await this.playSequence();
                }
                this.allowPlayer = true;
            } else {
                this.saveScore(this.sequence.length - 1);
                this.mistakeSound.play();
                await this.buttonDanve(2);
            }
        }
    }

    async reset(){
        this.allowPlayer = false;
        this.playerPlaybackPos = 0;
        this.sequence = [];
        this.updateScore('--');
        await this.buttonDance(1);
        this.addButton();
        await this.playSequence();
        this.allowPlayer = true;
    }



    
}