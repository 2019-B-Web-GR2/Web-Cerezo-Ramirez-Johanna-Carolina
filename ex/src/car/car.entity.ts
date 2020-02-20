import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { type } from 'os';
import { OwnerEntity } from '../owner/owner.entity';

@Entity('car_web')
export class CarEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_car',
    comment: 'Car´s table identifier'
  })
  id: number;

  @Index({
    unique: true,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'chasis',
    comment: 'car`s chassis number'
  })
  chassis?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'brand',
    comment: 'car`s brand'
  })
  brand?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'model',
    comment: 'car`s model'
  })
  model?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'color',
    comment: 'car`s color'
  })
  color?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'year',
    comment: 'car`s year'
  })
  year?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'price',
    comment: 'car`s price'
  })
  price?: number;

  @ManyToOne(
    type => OwnerEntity,
    owner => owner.cars,
  )
  owner: OwnerEntity;




}
