import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerEntity } from '../owner/owner.entity';
import { CarEntity } from './car.entity';
import { OwnerController } from '../owner/owner.controller';
import { OwnerService } from '../owner/owner.service';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { DetailService } from '../detail/detail.service';
import { DetailEntity } from '../detail/detail.entity';
import { HeaderService } from '../header/header.service';
import { HeaderEntity } from '../header/header.entity';

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
      CarController,
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

export class  CarModule {

}
