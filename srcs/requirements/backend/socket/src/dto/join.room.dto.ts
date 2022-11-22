import { IsOptional, ValidateIf, Length, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { RoomType } from 'src/dto/enum';

export class JoinRoomDto {
  @IsOptional()
  @IsNumber()
  public readonly roomId?: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  public readonly title: string;

  public readonly roomType: RoomType;

  @IsString()
  @ValidateIf(o => o.roomType !== RoomType.public)
  @IsNotEmpty()
  @Length(4, 8)
  public readonly password: string;
}
