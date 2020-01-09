import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsuarioEntity} from './usuario/usuario.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        type: 'mysql',
        host: 'localhost',
        port: 32769,
        username: 'johanna',
        password: 'johaweb',
        database: 'web',
        entities: [
          UsuarioEntity,
        ],
        synchronize: true, // Crear -> true , Conectar -> false
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
