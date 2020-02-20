import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from '../car/car.entity';
import { OwnerEntity } from '../owner/owner.entity';
import { DetailEntity } from '../detail/detail.entity';
import { CarController } from '../car/car.controller';
import { CarService } from '../car/car.service';
import { OwnerService } from '../owner/owner.service';
import { DetailService } from '../detail/detail.service';
import { HeaderEntity } from './header.entity';
import { HeaderService } from './header.service';

@Module(
  {
    imports: [
      TypeOrmModule
        .forFeature([
            HeaderEntity,
          ],
          'default', // Nombre de la cadena de conex.
        ),
    ],
    controllers: [
    ],
    providers: [
      HeaderService,
    ],
    exports: [
      HeaderService,
    ],
  })
export class  HeaderModule {

}
