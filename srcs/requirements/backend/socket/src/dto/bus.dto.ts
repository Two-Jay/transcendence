import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class BusDto {
    @IsBoolean()
    @IsNotEmpty()
    public readonly result: boolean;

    public value: any;
}
