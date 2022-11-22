import { IsNotEmpty, IsString } from 'class-validator';

export class UserSessionDto {
  @IsNotEmpty()
  @IsString()
  public readonly login: string;
}
