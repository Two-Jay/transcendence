import { IsNotEmpty, IsString } from 'class-validator';

export class AvatarDataDto {
  @IsNotEmpty()
  @IsString()
  public readonly login: string;

  @IsNotEmpty()
  @IsString()
  public readonly avatar: string;
}
