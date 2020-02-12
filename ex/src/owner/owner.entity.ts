import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { type } from 'os';

@Entity('owner_web')
export class OwnerEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_owner',
    comment: 'Owner´s table identifier'
  })
  id: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'name',
    comment: 'Owner´s name'
  })
  name?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'lastname',
    comment: 'Owner´s lastname'
  })
  lastname?: string;


  @Index({
    unique: true,
  })
  @Column({
    type: 'varchar',
    nullable: false,
    name: 'idCard',
    comment: 'Owner´s identification card'
  })
  idCard?: string;


}
