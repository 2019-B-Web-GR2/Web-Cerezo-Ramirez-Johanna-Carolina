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

  }
