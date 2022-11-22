import { IsNumber, IsNotEmpty, IsString } from "class-validator";
import { Socket } from 'socket.io';

export class GameMatchDto {
    @IsNumber()
    @IsNotEmpty()
    public readonly createAt: number;
    
    @IsString()
    @IsNotEmpty()
    public author: Socket;
}
