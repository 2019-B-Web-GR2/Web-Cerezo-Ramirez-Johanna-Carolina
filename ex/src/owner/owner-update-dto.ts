import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class OwnerUpdateDto{

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
  @IsNumber()
  @Min(0)
  id: number;

}
