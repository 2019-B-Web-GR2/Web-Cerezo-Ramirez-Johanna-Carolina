import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailEntity } from './detail.entity';
import { CarController } from '../car/car.controller';
import { CarService } from '../car/car.service';
import { OwnerService } from '../owner/owner.service';
import { DetailService } from './detail.service';
import { DetailController } from './detail.controller';
import { HeaderService } from '../header/header.service';

@Module(
  {
    imports: [
      TypeOrmModule
        .forFeature([
            DetailEntity,
          ],          'default', // Nombre de la cadena de conex.
        ),
    ],
    controllers: [
      DetailController,
    ],
    providers: [
      DetailService,
    ],
    exports: [
      DetailService,
    ],
  })

export class  DetailModule {

}