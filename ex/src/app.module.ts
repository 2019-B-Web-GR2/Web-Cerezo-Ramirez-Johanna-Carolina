import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OwnerEntity} from "./owner/owner.entity";
import {OwnerModule} from "./owner/owner.module";
import {OwnerService} from "./owner/owner.service";
import { CarEntity } from './car/car.entity';
import { CarModule } from './car/car.module';
import { CarService } from './car/car.service';
import { CarController } from './car/car.controller';
import { DetailEntity } from './detail/detail.entity';
import { HeaderEntity } from './header/header.entity';
import { HeaderService } from './header/header.service';
import { DetailService } from './detail/detail.service';
import { DetailModule } from './detail/detail.module';
import { HeaderModule } from './header/header.module';
import { ComprasModule } from './compras/compras.module';


@Module({
  imports: [
    ComprasModule,
    OwnerModule,
    HeaderModule,
    CarModule,
    DetailModule,
    TypeOrmModule.forRoot(
      {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'johanna',
        password: 'web2019',
        database: 'web',
        entities: [
          OwnerEntity,
          CarEntity,
          DetailEntity,
          HeaderEntity
        ],
        synchronize: true, // Crear -> true , Conectar -> false
        dropSchema: false,
      },
    ),


  ],
  controllers: [AppController],
  providers: [
    AppService,

  ],
  exports: [


  ],

})
export class AppModule {
  constructor(

    private _ownerService : OwnerService,
  ) {

  }



}
