import { IsDate, IsOptional, IsObject, Length, IsNotEmpty, IsString, Max } from 'class-validator';

export class OptionDataDto {
  @IsOptional()
  @IsString()
  @Length(1, 20)
  public readonly title: string;

  @IsOptional()
  @IsString()
  @Max(8)
  public readonly password: string;
}

export class MessageDataDto {
  @IsDate()
  @IsNotEmpty()
  public readonly timeStamp: Date;

  @IsString()
  public author: string;

  @IsString()
  public scope: string;

  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsOptional()
  @IsObject()
  public option: any;
}
