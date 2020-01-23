import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { MascotasEntity } from './mascotas.entity';

@Module(
  {
    imports: [
      TypeOrmModule
        .forFeature([
            MascotasEntity,
          ],
          'default', // Nombre de la cadena de conex.
        ),
    ],
  })

export class  MascotasModule {

}
