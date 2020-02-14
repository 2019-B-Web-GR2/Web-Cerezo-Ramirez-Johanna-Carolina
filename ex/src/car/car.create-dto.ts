import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { OwnerEntity } from '../owner/owner.entity';

export class CarCreateDto {

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(3)
  @MaxLength(80)
  chassis: string;



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
  @Length(4, 4)
  year: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  owner: OwnerEntity;



}
