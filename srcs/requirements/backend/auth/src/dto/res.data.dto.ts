import { IsNotEmpty, IsString } from 'class-validator';

export class ResDataDto {
  @IsString()
  public readonly token: string;
  public readonly options: { httpOnly: boolean; maxAge: number };
  public readonly tfaEnable: boolean;
  public readonly send: { result: boolean };
  public readonly profile?: boolean;
}
