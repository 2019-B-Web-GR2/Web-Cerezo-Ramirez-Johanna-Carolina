import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from '../car/car.entity';
import { OwnerEntity } from '../owner/owner.entity';
import { DetailEntity } from '../detail/detail.entity';
import { HeaderEntity } from '../header/header.entity';
import { CarController } from '../car/car.controller';
import { CarService } from '../car/car.service';
import { OwnerService } from '../owner/owner.service';
import { DetailService } from '../detail/detail.service';
import { HeaderService } from '../header/header.service';
import { ComprasController } from './compras.controller';

@Module(
  {
    imports: [
      TypeOrmModule
        .forFeature([
            CarEntity,
            OwnerEntity,
            DetailEntity,
            HeaderEntity,
          ],
          'default', // Nombre de la cadena de conex.
        ),
    ],
    controllers: [
      ComprasController,
    ],
    providers: [
      CarService,
      OwnerService,
      DetailService,
      HeaderService,
    ],
    exports: [
      CarService,
    ],
  })
export class ComprasModule {

}