import { Injectable } from '@nestjs/common';
import { DetailEntity } from './detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OwnerEntity } from '../owner/owner.entity';
import { DeleteResult, getManager, getRepository, Repository } from 'typeorm';
import { HeaderEntity } from '../header/header.entity';
import { empty } from 'rxjs/internal/Observer';


@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(DetailEntity) // Inyectar Dependencias
    private _repositorioDetail: Repository<DetailEntity>,
  ) {
  }

  encontrarUno(id: number): Promise<DetailEntity | undefined> {
    return this._repositorioDetail
      .findOne(id);
  }

  crearUno(detail: DetailEntity) {
    return this._repositorioDetail
      .save(detail);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioDetail
      .delete(id);
  }

  async buscarYBorrarCarDetails(idCar: number) : Promise<number> {
    const allDetails = await this._repositorioDetail.find({
      where: { idCar: idCar}, relations : ['car']
    });

    const detailsForCar:DetailEntity[] = [new DetailEntity()];
    allDetails.forEach((detail)=>{
      if(detail.car.id === idCar ){
        detailsForCar.push(detail)
      }
    });
    let valorARestar = 0;
    for (const detail of detailsForCar) {
      if(detail != undefined){
        valorARestar = valorARestar + detail.subtotal;
       // await this.borrarUno(detail.id)
      }

    }

    return  valorARestar;

  }

  actualizarUno(
    id: number,
    detail: DetailEntity
  ): Promise<DetailEntity> {
    detail.id = id;
    return this._repositorioDetail
      .save(detail); // UPSERT
  }

}