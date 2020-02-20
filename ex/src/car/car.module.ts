import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerEntity } from '../owner/owner.entity';
import { CarEntity } from './car.entity';
import { OwnerController } from '../owner/owner.controller';
import { OwnerService } from '../owner/owner.service';
import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module(
  {
    imports: [
      TypeOrmModule
        .forFeature([
            CarEntity,
            OwnerEntity,
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
    ],
    exports: [
      CarService,
    ],
  })

export class  CarModule {

}
