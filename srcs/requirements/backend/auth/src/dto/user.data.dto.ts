import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UserDataDto {
  @IsNotEmpty()
  @IsString()
  public readonly login: string;

  @IsNotEmpty()
  @IsNumber()
  public readonly createAt: number;

  @IsNotEmpty()
  @IsString()
  public nickname: string;

  @IsNotEmpty()
  @IsString()
  public avatar: string;

  @IsNotEmpty()
  @IsBoolean()
  public tfaEnable: boolean;

  // @IsNotEmpty()
  // @IsBoolean()
  // public isVerified: boolean;

  @IsNumber()
  public authConfirmCode: number;

  @IsNotEmpty()
  @IsString()
  public accessToken: string;

  @IsNotEmpty()
  @IsString()
  public refreshToken: string;
}
