//https://dev.to/codesphere/can-we-make-pong-in-less-than-a-100-lines-of-javascript-3ah1
//https://kellylougheed.medium.com/javascript-pong-with-p5-js-3ae1b859418c
//https://github.com/ivailop7/IvoPong/blob/main/src/sketch.tsx
//https://github.com/Gherciu/react-p5
//https://github.com/Sh3B0/PongMe/blob/main/src/game.ts
//https://stackoverflow.com/questions/72881145/detect-multiple-keypresses-and-trigger-an-action-once-in-p5-js
//https://editor.p5js.org/mrcircuit1234/sketches/zGvcNLjD3
//https://codepen.io/luanmanara/pen/YzWGKPQ

import React, { useEffect, useContext } from "react";
import dynamic from 'next/dynamic'


//https://stackoverflow.com/questions/69560127/p5js-with-next-js-window-is-not-defined-even-in-useeffect
//import Sketch from "react-p5";

/*
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})
*/

const Sketch = dynamic(import('react-p5'), { ssr: false })

import P5 from "p5"; //Import this for typechecking and intellisense
import { G_KEY, Pong, keyIsDown, W_KEY, S_KEY } from "./PongHelper";
import { SocketContext } from "../context/SocketContext";
import { GamePlayDto, GameRoomDto } from "../recoil/gameType";
import { RecoilState, useRecoilState, useRecoilValue } from "recoil";
import { Label } from "flowbite-react";
import { currentGameRoomIdAtom, gameSelector } from "../recoil/gameState";
import { whoamiAtom } from "../recoil/whoamiState";
import { nicknameAtom } from "../recoil/nicknameState";
import { GameMode } from "../recoil/socketType";






// interface ComponentProps {
//   //Your component props
// }
// const PongGame: React.FC<ComponentProps> = (props: ComponentProps) => {



const PongGame: React.FC = () => {
  const socket = useContext(SocketContext);
  const fps: number = 60;


  const whoami = useRecoilValue(whoamiAtom);
  const nickname = useRecoilValue(nicknameAtom);
  const username = whoami?.whoami;

  const [roomId, _0] = useRecoilState(currentGameRoomIdAtom);

  const game = useRecoilValue<GameRoomDto | undefined>(gameSelector(roomId) as RecoilState<GameRoomDto>);

  let startGame0 = false;

  const width = 2000;
  const height = 1000;
  const br = 30; //ball radius
  const pw = 20; //paddle width
  const ps = 30; //paddle shift from wall
  const xshift = (br + pw + ps);
  const yshift = (br);
  const scale = 0.25;//25
  const canvasWidth = (width + 2 * xshift) * scale;
  const canvasHeight = (height + 2 * yshift) * scale;
  const pressed = new Set<number>();
  //const gameStorage = GameStorage.getInstance();
  //let i = 0;
  //const sy = 1000 / canvasHeight;

  // const now = new Date();

  // let gamePlayDto : GamePlayDto = {
  //   // timeStamp: new Date(),
  //   //author: '',
  //   roomId: 7,
  //   timeStamp: [now, now],
  // };

  let countDown = 20;
  let ballSpeed = 1;
  let playerNo = 0;

    useEffect(() => {
      console.log("pong mount");
      //socketInitializer();

      return () => {
        console.log("pong unmount");
        window.localStorage.removeItem(socket.id);
        //writeToLocal();
      };
    },[]);

    useEffect(()=>{

    }, [game?.playerSocketId])




  function keyPressed(e: any) {
    if (!pressed.has(e.keyCode) && e.keyCode !== G_KEY) {
      pressed.add(e.keyCode);
    }
  }

  function keyReleased(e: any) {
    pressed.delete(e.keyCode);
    if (e.keyCode === G_KEY)
      startGame0 = !startGame0;
  }

  const pong = new Pong(width, height);

  function linedash(p5:P5, x1:number, y1:number, x2:number, y2:number, delta:number, style:string = '-') {
    // delta is both the length of a dash, the distance between 2 dots/dashes, and the diameter of a round
    let distance = p5.dist(x1,y1,x2,y2);
    let dashNumber = distance/delta;
    let xDelta = (x2-x1)/dashNumber;
    let yDelta = (y2-y1)/dashNumber;

    for (let i = 0; i < dashNumber; i+= 2) {
      let xi1 = i*xDelta + x1;
      let yi1 = i*yDelta + y1;
      let xi2 = (i+1)*xDelta + x1;
      let yi2 = (i+1)*yDelta + y1;

      if (style == '-') { p5.line(xi1, yi1, xi2, yi2); }
      else if (style == '.') { p5.point(xi1, yi1); }
      else if (style == 'o') { p5.ellipse(xi1, yi1, delta/2); }
    }
  }

  function drawUI(p5:P5) {
    // p5.fill("white");

    //const canvasWidth = 600;
    //const canvasHeight = 300;


    //drawingContext.setLineDash([5, 15]);



    p5.fill("gray");
    //p5.strokeWeight(10);
    linedash(p5, canvasWidth/2, 0,
                 canvasWidth/2, canvasHeight,
                 3, 'o');
    //p5.stroke(100);
    //p5.line(30, 20, 85, 75);

    // p5.fill("gray");
    // p5.rect(300,0,1,300);


    linedash(p5,xshift*scale, yshift*scale,
                xshift*scale, (yshift+height)*scale,
                 3, 'o');
    linedash(p5,(xshift+width)*scale, yshift*scale,
                (xshift+width)*scale, (yshift+height)*scale,
                 3, 'o');

    linedash(p5,xshift*scale, yshift*scale,
                (xshift+width)*scale, yshift*scale,
                3, 'o');
    linedash(p5,xshift*scale, (yshift+height)*scale,
                (xshift+width)*scale, (yshift+height)*scale,
                3, 'o');

    p5.fill("white");

    if (playerNo === 1)
      p5.fill("Green");

    p5.rect((ps+ pong.player[0]!.pos.x) * scale,
            (yshift+ pong.player[0]!.pos.y - pong.player[0]!.height/2) * scale,
            pw * scale,
            pong.player[0]!.height * scale);
    p5.fill("white");

    if (playerNo === 2)
      p5.fill("Green");

    p5.rect((xshift + br + pong.player[1]!.pos.x) * scale,
            (yshift + pong.player[1]!.pos.y  - pong.player[1]!.height/2) * scale,
            pw * scale,
            pong.player[1]!.height * scale);

    p5.fill("white");

    if (ballSpeed === GameMode.normal) {
      p5.fill('White');
      p5.ellipse((xshift + pong.ball.pos.x) * scale,
      (yshift + pong.ball.pos.y) * scale,
      br * 2 * scale,
      br * 2 * scale);
    }
    else if (ballSpeed === GameMode.speedy) {
      p5.fill('magenta');
      const x = (xshift + pong.ball.pos.x) * scale;
      const y = (yshift + pong.ball.pos.y) * scale;
      const radius = br * 2 * scale;
      p5.ellipse(x, y, br * 2 * scale, br * 2 * scale);
      p5.fill('red');
      for (let i = 0; i < 20; i++) {
        const r = radius * Math.sqrt(Math.random()) * 0.75;
        const theta = Math.random() * 2 * Math.PI;
        p5.ellipse(x + r * Math.cos(theta), y +  r * Math.sin(theta), br * scale/2, br * scale/2);
      }
    }

    p5.fill('White');
    p5.textSize(32);
    p5.fill(255);
    p5.text(pong.player[0]!.score, xshift*scale + 20, (yshift*scale + 40));
    p5.text(pong.player[1]!.score, -xshift*scale + canvasWidth - 40, (yshift*scale+40));

    if (countDown > 0)
      p5.text(countDown, canvasWidth/2 -10, 50);

  }


  function setup(p5:P5, canvasParentRef: Element) { // Runs on startup

    console.log('pong', 'call setup');
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.noStroke();
    p5.background(0);
    p5.frameRate(fps);

    //pong = new Pong(p, canvasWidth, canvasHeight);
    console.log("pong in setup", pong);
    //readFromLocal();

  }

  function draw(p5:P5) {
    p5.background(0);
    // readFromLocal();
    keyIsDown(pressed, G_KEY);
    // if (keyIsDown(pressed, G_KEY)) {
    //   //startGame0 = (!startGame0);
    //   //setStartGame(!startGame);
    //   console.log("startGame0", startGame0);
    // }

    //const millis = p5.millis();
    //currentTime = Math.round(millis / 1000);
    //countDown = targetTime - currentTime;

    // if (startGame0) {

      // if (bGo) {
    const gamePlayDtoSource = window.localStorage.getItem(socket.id);
    const gamePlayDto: GamePlayDto = JSON.parse(gamePlayDtoSource!);
    if (!gamePlayDto) return;

    if (!gamePlayDto.paddlePosition) return;

    if (gamePlayDto.player[0] === whoami?.whoami)
      playerNo = 1;
    else if (gamePlayDto.player[1] === whoami?.whoami)
      playerNo = 2;

    //pong.player[0]!.pos.y = gamePlayDto.paddlePosition[0];
    //pong.player[1]!.pos.y = gamePlayDto.paddlePosition[1];
    pong.setYY(gamePlayDto.paddlePosition[0] as number, gamePlayDto.paddlePosition[1] as number);


    if (!gamePlayDto.ballPosition) return;
    pong.ball.pos.x = gamePlayDto.ballPosition[0]!;
    pong.ball.pos.y = gamePlayDto.ballPosition[1]!;

    if (!gamePlayDto.score) return;
    pong.player[0]!.score = gamePlayDto.score[0]!;
    pong.player[1]!.score = gamePlayDto.score[1]!;

    const ballDate = new Date(gamePlayDto.ballTime);
    const now = new Date();
    countDown = Math.floor((ballDate.getTime() - now.getTime())/1000) ;
    ballSpeed = gamePlayDto.speed as number;

    const isUp = keyIsDown(pressed, W_KEY) ? 1 : 0;
    const isDown = keyIsDown(pressed, S_KEY)? -1 : 0;
    const move = isUp + isDown;

    socket.emit('move_paddle', move);


    drawUI(p5);

  }



  return (
    <div className="pongholder">
      <div className="flex flex-col gap-2">

      <div className="mb-2 block">

        <div className="pt-2 pl-5">
        <Label >
          <div className="dark:text-white-300">
              Username: <span className="text-yellow-400">{username}&nbsp;&nbsp;</span>
              Nickname: <span className="text-yellow-400">{nickname}&nbsp;&nbsp;</span>
            </div>
          {/* username: {username}, nickname: {nickname} */}
          </Label>
          </div>
        <div className="pl-5"><Label >
            <div className="dark:text-white-300">
              ID:&nbsp;
              <span className="text-yellow-400">
              {roomId || 'not selected'}&nbsp;&nbsp;
              </span>
              TITLE:&nbsp;
              <span className="text-yellow-400">
              {game?.title || 'not selected'}&nbsp;&nbsp;
              </span>
            </div>
          {/* id: {roomId || 'not selected'}, title: {game?.title || 'not selected'} */}
        </Label></div>
      </div>

      {roomId !== 0 ? <Sketch setup={setup} draw={draw} keyPressed={keyPressed} keyReleased={keyReleased} /> : null}



      </div>


    </div>
  );



}


export default PongGame;
