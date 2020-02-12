import {Module} from "@nestjs/common";
import {OwnerController} from "./owner.controller";
import {OwnerService} from "./owner.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OwnerEntity} from "./owner.entity";

@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          OwnerEntity // Entidades a usarse dentro
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
  ],
  exports: [
    OwnerService,
  ],
})
export class OwnerModule {

}
