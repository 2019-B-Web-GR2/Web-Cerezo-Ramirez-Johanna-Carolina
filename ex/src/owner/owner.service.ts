import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OwnerEntity} from "./owner.entity";
import { DeleteResult, getRepository, Like, MoreThan, Repository } from 'typeorm';
import { CarEntity } from '../car/car.entity';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(OwnerEntity) // Inyectar Dependencias
    private _repositorioOwner: Repository<OwnerEntity>
  ) {
  }

  encontrarUno(id: number): Promise<OwnerEntity | undefined> {
    return this._repositorioOwner
      .findOne(id);
  }

  crearUno(owner: OwnerEntity) {
    return this._repositorioOwner
      .save(owner);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioOwner
      .delete(id);
  }

  actualizarUno(
    id: number,
    owner: OwnerEntity
  ): Promise<OwnerEntity> {
    owner.id = id;
    return this._repositorioOwner
      .save(owner); // UPSERT
  }

  buscar(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'ASC',
    }
  ): Promise<OwnerEntity[]> {

    // Exactamente el name o Exactamente la idCard
    const consultaWhere = [
      {
        name: ''
      },
      {
        lastname: ''
      },
      {
        idCard: ''
      }
    ];

    // Exactamente el name o LIKE la idCard
    const consultaWhereLike = [
      {
        name: Like('a%')
      },
      {
        lastname: Like('a%')
      },
      {
        idCard: Like('%a')
      }
    ];

    // id sea mayor a 20
    const consultaWhereMoreThan = {
      id: MoreThan(20)
    };

    // id sea igual a x
    const consultaWhereIgual = {
      id: 30
    };

    return this._repositorioOwner
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
      });
  }

  async buscarCars(idOwner : number) : Promise<CarEntity[]>{
     const owner = await this._repositorioOwner.findOne({
       where: { id: idOwner}, relations : ['cars']
     });
    return owner.cars;
  }



}
