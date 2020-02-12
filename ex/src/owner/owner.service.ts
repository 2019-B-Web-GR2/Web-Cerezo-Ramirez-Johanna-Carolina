import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OwnerEntity} from "./owner.entity";
import {DeleteResult, Like, MoreThan, Repository} from "typeorm";

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




}
