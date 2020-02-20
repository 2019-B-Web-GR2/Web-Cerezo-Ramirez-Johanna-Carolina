import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CarEntity} from "./car.entity";
import {DeleteResult, Like, MoreThan, Repository} from "typeorm";


@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarEntity) // Inyectar Dependencias
    private _repositorioCar: Repository<CarEntity>
  ) {
  }

  encontrarUno(id: number): Promise<CarEntity | undefined> {
    return this._repositorioCar
      .findOne(id);
  }

  crearUno(owner: CarEntity) {
    return this._repositorioCar
      .save(owner);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioCar
      .delete(id);
  }

  actualizarUno(
    id: number,
    owner: CarEntity
  ): Promise<CarEntity> {
    owner.id = id;
    return this._repositorioCar
      .save(owner); // UPSERT
  }

  buscarPorOwner(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'DESC',
      chassis: 'ASC'
    }
  ){

  }

  buscar(
    where: any = {},
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'DESC',
      chassis: 'ASC'
    }
  ): Promise<CarEntity[]> {

    // Exactamente el chassis o Exactamente la color
    const consultaWhere = [
      {
        chassis: ''
      },
      {
        brand: ''
      },
      {
        model: ''
      },
      {
        color: ''
      },
      {
        year: ''
      },
      {
        price:''
      },
      {
        owner:''
      }
    ];

    // Exactamente el chassis o LIKE la color
    const consultaWhereLike = [
      {
        chassis: ''
      },
      {
        brand: ''
      },
      {
        model: ''
      },
      {
        color: ''
      },
      {
        year: ''
      },
      {
        price:''
      },
      {
        owner:''
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

    return this._repositorioCar
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
      });

  }

}
