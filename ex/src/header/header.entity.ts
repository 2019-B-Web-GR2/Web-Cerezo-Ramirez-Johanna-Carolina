import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarEntity } from '../car/car.entity';
import { DetailEntity } from '../detail/detail.entity';

@Entity('header_web')
export class HeaderEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_owner',
    comment: 'Headers´s table identifier'
  })
  id: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'state',
    comment: 'Header´s state'
  })
  state?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'date',
    comment: 'Header´s date'
  })
  date?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'address',
    comment: 'Header´s address'
  })
  address?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'float',
    nullable: true,
    name: 'total',
    comment: 'Header´s total'
  })
  total?: number;

  @OneToMany(
    // tslint:disable-next-line:no-shadowed-variable
    type => DetailEntity, //Entidad
    detail => detail.header, //Nombre del campo
  )
  details: DetailEntity[];

}