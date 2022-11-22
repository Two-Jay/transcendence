import { socket } from "../context/SocketContext";
import { GamePlayDto } from "../recoil/gameType";

export const ESC = 27;
export const SPACEBAR = 32;
export const UP_ARROW = 38;
export const DOWN_ARROW = 40;
export const LEFT_ARROW = 37;
export const RIGHT_ARROW = 39;
export const W_KEY = 87;
export const S_KEY = 83;
export const O_KEY = 79;
export const K_KEY = 75;
export const G_KEY = 71;

export function keyIsDown(pressed: Set<number>, key: number) {
  if (pressed.has(key))// && pressed.size === 1)
    return true;
  return false;
}

export interface Vec {
  x: number;
  y: number;
}

const normalizeBetweenTwoRanges = (val : number, minVal: number, maxVal: number, newMin: number, newMax: number) => {
  return newMin + (val - minVal) * (newMax - newMin) / (maxVal - minVal);
};

export class Paddle {

  pongWidth: number;
  pongHeight: number;
  isLeft: boolean;
  upKey: number;
  downKey: number;
  width: number;
  height: number;
  pos: Vec;
  velocity: number;
  score: number;

  constructor(pongWidth: number, pongHeight: number, isLeft: boolean, upKey: number, downKey: number) {
    this.pongWidth = pongWidth;
    this.pongHeight = pongHeight;
    this.isLeft = isLeft;
    this.upKey = upKey;
    this.downKey = downKey;
    this.width = 0; //20;//this.pongWidth / 64;
    this.height = 300;//this.pongHeight / 3.33;
    this.velocity = 0;
    this.pos = {x:0, y:(this.pongHeight / 2) - (this.height / 2)};
    this.score = 0;
    this.drawMiddle();
    this.reset();

  }

  update(pressed: Set<number>) {
    if (keyIsDown(pressed, this.upKey) && (this.pos.y - this.height/2) > 0) {
      this.pos.y -= this.velocity;
    } else if (keyIsDown(pressed, this.downKey) && (this.pos.y + this.height/2) < this.pongHeight) {
      this.pos.y += this.velocity;
    }
    return (this.pos.y);
  }

  drawMiddle() {
    this.pos = {x:0, y:(this.pongHeight / 2)};

    if (this.isLeft) {
      this.pos.x = 0;//30;
    } else {
      this.pos.x = this.pongWidth; // - this.width;//- 30;
    }

  }

  setY(y: number) {
    this.pos.y = y;
  }

  reset() {
    this.velocity = 15;
    this.score = 0;
  }
}

export class Ball {
  pongWidth: number;
  pongHeight: number;
  pos: Vec;
  r: number;
  v: number;
  velocity: Vec;

  constructor(pongWidth: number, pongHeight: number) {
    this.pongWidth = pongWidth;
    this.pongHeight = pongHeight;
    this.pos = {x:this.pongWidth / 2, y:this.pongHeight / 2};
    this.r = 0; //30;//(pongWidth * pongHeight) / 60000;
    this.v = 15;
    this.velocity = {x:0, y:0};

    this.drawMiddle();
    // this.reset();
    this.reset(0);
  }

  setV(v:number) {
    this.v = v;
  }

  goal(who: string) {
    return {
      login: who,
    }
  }

  update(players: Paddle[]): boolean {
    for (var i = 0; i < players.length; i++) {
      this.collide(players[i]!);
    }

    let goal = false;

    const gamePlayDtoSource = window.localStorage.getItem(socket.id);
    const gamePlayDto: GamePlayDto = JSON.parse(gamePlayDtoSource!);
    if (!gamePlayDto) return goal;

    players[0]!.score = gamePlayDto.score![0]!;
    players[1]!.score = gamePlayDto.score![1]!;

    if (this.pos.x > this.pongWidth) {
      goal = true;
    } else if (this.pos.x < 0) {
      goal = true;
    } else {
      this.bounce();
      this.pos.x += this.velocity.x;
      this.pos.y += this.velocity.y;
    }

    if (goal) {
      // this.drawMiddle();
      // // this.reset();
      // this.reset(0);
    }

    return goal;
  }


  drawMiddle() {
    this.pos.x = this.pongWidth / 2;
    this.pos.y = this.pongHeight / 2;
  }


  reset(angle: number) {
    this.velocity.x = this.v * Math.cos(angle);
    this.velocity.y = this.v * Math.sin(angle);

    // if (angle === 0) {
    //   this.velocity.x = 0;
    //   this.velocity.y = 0;
    // }
    // else {
    //   this.velocity.x = this.v * Math.cos(angle);
    //   this.velocity.y = this.v * Math.sin(angle);
    // }

    // Math.random() < 0.5 ? this.velocity.x *= -1 : this.velocity.x;
  }


  bounce() {
    if (this.pos.y > this.pongHeight - this.r || this.pos.y < 0 + this.r) {
      this.velocity.y *= -1;
      console.log("ball bounced the wall");
    }
  }


  collide(player: Paddle) {
    var rad = 45 / 180 * Math.PI;

    if (this.pos.y > (player.pos.y - player.height/2 - this.v*2) &&
        this.pos.y < (player.pos.y + player.height/2 + this.v*2)) {
      //if ((player.isLeft && this.pos.x < player.pos.x + player.width + this.r) ||
      if ((player.isLeft && this.pos.x < player.pos.x + this.v) ||
          (!player.isLeft && this.pos.x > player.pos.x - this.v)  )
      {
          var diff = this.pos.y - (player.pos.y - player.height/2);

          var angle = normalizeBetweenTwoRanges(diff, 0, player.height, -rad, rad);
          var dir = player.isLeft ? 1 : -1;

          this.velocity.x = this.v * Math.cos(angle) * dir;
          this.velocity.y = this.v * Math.sin(angle);

          if (player.isLeft)

            console.log("left hits the ball");
          else
            console.log("right hits the ball");
      }
    }
  }
}


export class Pong {
  pongWidth: number;
  pongHeight: number;
  player: Paddle[];
  ball: Ball;

  constructor(pongWidth: number, pongHeight: number,) {

    this.pongWidth = pongWidth;
    this.pongHeight = pongHeight;

    this.player = [];
    this.player.push(new Paddle(pongWidth, pongHeight, true, W_KEY, S_KEY));
    this.player.push(new Paddle(pongWidth, pongHeight, false, O_KEY, K_KEY));
    this.ball = new Ball(pongWidth, pongHeight);

  }

  update(cond: boolean, pressed: Set<number>) {
    if (cond) {
      this.player[0]?.update(pressed);
      this.player[1]?.update(pressed);
      this.ball.update(this.player);
    }
  }

  setYY(player1y: number, player2y: number) {
    this.player[0]?.setY(player1y);
    this.player[1]?.setY(player2y);
  }

  reset() {
    this.player[0]?.drawMiddle();
    this.player[0]?.reset();
    this.player[1]?.drawMiddle();
    this.player[1]?.reset();
    this.ball.drawMiddle();
    // this.ball.reset();
    this.ball.reset(0);
  }
}

/*
    // if (player.isLeft) {
    //   if (this.pos.x < player.pos.x + player.width + this.r) {
    //     if (this.pos.y > player.pos.y - player.height/2 && this.pos.y < player.pos.y + player.height/2) {
    //         var diff = this.pos.y - (player.pos.y - player.height/2);

    //       var angle = normalizeBetweenTwoRanges(diff, 0, player.height, -rad, rad);

    //       this.velocity.x = this.v * this.vl * Math.cos(angle);
    //       this.velocity.y = this.v * this.vl * Math.sin(angle);
    //       console.log("left hits the ball");
    //     }
    //   }
    // } else {
    //   if (this.pos.x > player.pos.x - this.r) {
    //     if (this.pos.y > player.pos.y - player.height/2 && this.pos.y < player.pos.y + player.height/2) {
    //         var diff = this.pos.y - (player.pos.y - player.height/2);

    //       var angle = normalizeBetweenTwoRanges(diff, 0, player.height, -rad, rad);

    //       this.velocity.x = (this.v * this.vr * Math.cos(angle)) * -1;
    //       this.velocity.y = this.v * this.vr * Math.sin(angle);
    //       console.log("right hits the ball");
    //     }
    //   }
    // }

*/
