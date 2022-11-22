import { Min, Max, IsDate, IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { Move } from 'src/config/struct';
// import { Socket } from 'socket.io';

export class GamePlayDto {
    /**
      * params: login: <string>
      */
    @IsString()
    public author: string;

    /**
      * params: roomId: <number>
      */
    @IsNumber()
    public readonly roomId: number;

    /**
      * params: player: <string[]>
      */
    @IsString()
    @IsNotEmpty()
    public readonly player: string[];

    @IsDate()
    @IsNotEmpty()
    public paddleTime: Date[];

    @IsNotEmpty()
    public control: Move[];

    /**
      * params: paddlePosition: <number[2]> [player1, player2] scale x1000
      */
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(1 * 1000)
    public readonly paddlePosition: number[]; // [x | y] * 1000 // normalized player1, player2

    @IsDate()
    @IsNotEmpty()
    public ballTime: Date;

    /**
      * params: ballPosition: <number[2]> scale x1000
      */
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(2 * 1000)
    public readonly ballPosition: number[]; // [x, y] * 1000 // normalized

    /**
      * params: score: <number[2]>
      */
    @IsNumber()
    @IsNotEmpty()
    public score: number[];
 
    /**
      * params: speed: <number>
      */
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(1000)
    public readonly speed: number; // 1 ~ 1000 or fixed number?

    /**
      * params: angle: <number> radian value
      */
    @IsNumber()
    @IsNotEmpty()
    // @Min(0)
    // @Max(Math.PI * 2 * 1000)
    public angle: number; // 0 ~ Math.PI * 1000 // exclude 0, Math.PI * 1000
}
