import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuario_web')  //nombre de la entidad en la base de datos
export class UsuarioEntity {
  //aqui se definen indices, claves primarias, columnas, tipos de las columnas, etc, ect
  // el estandar para base de datos es todo minusculas y separado con guiones bajos 
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true, // que sea un entero psoitivo es decir sin signo
    name: 'id_web',
    comment: 'Identificador de la tabla'
  })
  id: number;
}
