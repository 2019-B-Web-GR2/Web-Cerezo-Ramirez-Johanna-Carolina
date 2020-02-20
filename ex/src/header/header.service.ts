import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { HeaderEntity } from './header.entity';



@Injectable()
export class HeaderService {
  constructor(
    @InjectRepository(HeaderEntity) // Inyectar Dependencias
    private _repositorioHeader: Repository<HeaderEntity>
  ) {
  }

  encontrarUno(id: number): Promise<HeaderEntity | undefined> {
    return this._repositorioHeader
      .findOne(id);
  }

  crearUno(header: HeaderEntity) {
    return this._repositorioHeader
      .save(header);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioHeader
      .delete(id);
  }

  actualizarUno(
    id: number,
    header: HeaderEntity
  ): Promise<HeaderEntity> {
    header.id = id;
    return this._repositorioHeader
      .save(header); // UPSERT
  }

}