import {IsNotEmpty, IsNumberString, IsString, Max, MaxLength, Min, MinLength} from "class-validator";

export class OwnerCreateDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  lastname: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(3)
  @MaxLength(80)
  idCard: string;


}
