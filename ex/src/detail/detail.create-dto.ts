import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { CarEntity } from '../car/car.entity';
import { HeaderEntity } from '../header/header.entity';

export class DetailCreateDto {

  @IsNotEmpty()
  @IsNumber()
  @MinLength(1)
  @MaxLength(8)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(4)
  @MaxLength(20)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(4)
  @MaxLength(20)
  subtotal: number;

  @IsNotEmpty()
  car: CarEntity;

  @IsNotEmpty()
  header: HeaderEntity;

}