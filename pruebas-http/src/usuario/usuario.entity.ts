import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { type } from 'os';
import { MascotasEntity } from '../mascotas/mascotas.entity';

@Entity('usuario_web')
export class UsuarioEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_web',
    comment: 'Identificador de la tabla usuario'
  })
  id: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'nombre',
    comment: 'Nombre de la tabla usuario'
  })
  nombre?: string;

  @Index({
    unique: true,
  })
  @Column({
    type: 'varchar',
    nullable: false,
    name: 'cedula',
    comment: 'Cedula de la tabla usuario'
  })
  cedula: string;

  @OneToMany(
    // tslint:disable-next-line:no-shadowed-variable
    type => MascotasEntity, //Entidad
    mascota => mascota.usuario, //Nombre del campo
  )
  mascotas: MascotasEntity[];
}
