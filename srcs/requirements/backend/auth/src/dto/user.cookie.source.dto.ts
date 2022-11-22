import { IsDate, IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class UserCookieSourceDto {
  @IsNotEmpty()
  @IsString()
  public readonly login: string;

  @IsNotEmpty()
  @IsNumber()
  public readonly createAt: number;
}
