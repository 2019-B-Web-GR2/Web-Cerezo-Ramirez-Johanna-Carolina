import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Entity('bdd_mascota')
export class MascotasEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('nombre_mascota')
  @Column({
      type: 'varchar',
      nullable: false,
      unique: true,
      name: 'bdd_nombre',
    }  )
  nombre: string;

  @Column({
    type: 'date',
    nullable: true,
    name: 'bdd_fec_nacimiento',
  }  )
  fechaNacimiento: string;

  @ManyToOne(
    type => UsuarioEntity,
    usuario => usuario.mascotas,
  )
  usuario: UsuarioEntity;
}
