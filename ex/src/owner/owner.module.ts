import {Module} from "@nestjs/common";
import {OwnerController} from "./owner.controller";
import {OwnerService} from "./owner.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OwnerEntity} from "./owner.entity";
import { CarService } from '../car/car.service';
import { CarEntity } from '../car/car.entity';

@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          OwnerEntity,
          CarEntity,// Entidades a usarse dentro
                        // del modulo.
        ],
        'default' // Nombre de la cadena de conex.
      ),
  ],
  controllers: [
    OwnerController,
  ],
  providers: [
    OwnerService,
    CarService,
  ],
  exports: [
    OwnerService,
    CarService,
  ],
})
export class OwnerModule {

}
