import {
  IsDate,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class HeaderCreateDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(8)
  state: string;

  @IsNotEmpty()
  @IsISO8601()
  date: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  address: string;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(4)
  @MaxLength(20)
  total: number;


}