import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OwnerEntity } from '../owner/owner.entity';
import { HeaderEntity } from '../header/header.entity';
import { CarEntity } from '../car/car.entity';

@Entity('header_detail_web')
export class DetailEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_owner',
    comment: 'Header details table identifier'
  })
  id: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'int',
    nullable: true,
    name: 'quantity',
    comment: 'Header details quantity'
  })
  quantity?: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'int',
    nullable: true,
    name: 'price',
    comment: 'Header details price'
  })
  price?: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'float',
    nullable: true,
    name: 'subtotal',
    comment: 'Header details subtotal'
  })
  subtotal?: number;

  @ManyToOne(
    type => HeaderEntity,
    header => header.details,
  )
  header: HeaderEntity;

  @ManyToOne(
    type => CarEntity,
    car => car.details,
  )
  car: CarEntity;

}