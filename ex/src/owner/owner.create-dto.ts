import {IsNotEmpty, IsNumberString, IsString, Max, MaxLength, Min, MinLength} from "class-validator";

export class OwnerCreateDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  lastname: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(10)
  @MaxLength(10)
  idCard: string;


}
