import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OwnerEntity} from "./owner/owner.entity";
import {OwnerModule} from "./owner/owner.module";
import {OwnerService} from "./owner/owner.service";
import { CarEntity } from './car/car.entity';
//import {CarModule } from './car/car.module';
//import {CarEntity } from './car/car.entity';

@Module({
  imports: [
    OwnerModule,
   //CarModule,
    TypeOrmModule.forRoot(
      {
        type: 'mysql',
        host: 'localhost',
        port: 32769,
        username: 'johanna',
        password: 'web2019',
        database: 'web',
        entities: [
          OwnerEntity,
          CarEntity,
        ],
        synchronize: true, // Crear -> true , Conectar -> false
        dropSchema: false,
      },
    ),


  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {
  constructor(
    private _ownerService: OwnerService,
  ) {

  }

}
