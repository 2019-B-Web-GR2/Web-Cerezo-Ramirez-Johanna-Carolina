import {IsNotEmpty, IsNumberString, IsString, Max, MaxLength, Min, MinLength} from "class-validator";

export class CarCreateDto {

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(3)
  @MaxLength(80)
  chasis: string;


  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  brand: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  model: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  color: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(4)
  @MaxLength(4)
  year: string;

}
