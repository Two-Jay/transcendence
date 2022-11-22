import { IsNotEmpty, IsString } from 'class-validator';

export class UserOAuthDto {
  @IsNotEmpty()
  @IsString()
  public readonly login: string;

  @IsNotEmpty()
  @IsString()
  public accessToken: string;

  @IsNotEmpty()
  @IsString()
  public refreshToken: string;
}
