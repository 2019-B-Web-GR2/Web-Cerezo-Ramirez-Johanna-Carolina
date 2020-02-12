import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerEntity } from '../owner/owner.entity';
import { CarEntity } from './car.entity';

@Module(
  {
    imports: [
      TypeOrmModule
        .forFeature([
            CarEntity,
          ],
          'default', // Nombre de la cadena de conex.
        ),
    ],
  })

export class  CarModule {

}
