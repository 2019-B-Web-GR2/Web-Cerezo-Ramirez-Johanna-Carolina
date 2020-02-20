import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query, Req, Res,
  Session, SetMetadata,
  UnauthorizedException, UseGuards,
} from '@nestjs/common';
import {OwnerService} from './owner.service';
import {OwnerEntity} from './owner.entity';
import { DeleteResult, Like } from 'typeorm';
import {OwnerCreateDto} from './owner.create-dto';
import {OwnerUpdateDto} from './owner-update-dto';
import {validate} from 'class-validator';
import * as Joi from '@hapi/joi';
import { options } from 'tsconfig-paths/lib/options';
import { tryCatch } from 'rxjs/internal-compatibility';
import { response } from 'express';
import { CarEntity } from '../car/car.entity';
import { async } from 'rxjs/internal/scheduler/async';
import { CarService } from '../car/car.service';
import { RolesGuard } from '../roles.guard';

// JS const Joi = require('@hapi/joi');

@Controller('owner')
@UseGuards(RolesGuard)
export class OwnerController {
  constructor(
    private readonly _ownerService: OwnerService, private _carService: CarService,
  ) {

  }


  @Get('mostrar-owners')
  @SetMetadata('roles', ['Administrador'])
  async rutaMostrarOwners(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
    @Query('consultaOwner') consultaOwner: string,
  ) {
    let consultaServicio;
    if (consultaOwner) {
      consultaServicio = [
        {
          name: Like('%' + consultaOwner + '%'),
        },
        {
          lastname: Like('%' + consultaOwner + '%'),
        },
        {
          idCard: Like('%' + consultaOwner + '%'),
        },
      ];
    }
    const owners = await this._ownerService.buscar(consultaServicio);
    res.render('owner/show-search-owner',
      {
        datos: {
          error,
          mensaje,
          owners, // es igual a owners:owners
        },
      },

    );
  }

  @Post('crear')
  @SetMetadata('roles', ['Administrador'])
  async crearUnOwner(
    @Body() owner: OwnerEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const ownerCreateDTO = new OwnerCreateDto();
    ownerCreateDTO.name = owner.name;
    ownerCreateDTO.lastname = owner.lastname;
    ownerCreateDTO.idCard = owner.idCard;
    const errores = await validate(ownerCreateDTO);
    if (errores.length > 0) {

      res.redirect(
        '/owner/create-owner?error=Error validando',
      );
    } else {
      try {
        await this._ownerService
          .crearUno(
            owner,
          );
        res.redirect(
          '/owner/create-owner?mensaje=El usuario se creo correctamente',
        );
      } catch (error) {
        console.error(error);
        res.redirect(
          '/owner/create-owner?error=Error del servidor',
        );
      }
    }
  }

  @Get('create-owner')
  @SetMetadata('roles', ['Administrador'])
  rutaCrearOwners(
    @Query('error') error: string,
    @Query('mensaje') mensaje: string,
    @Res() res,
  ) {
    res.render('owner/create-owner',
      {
        datos: {
          error, mensaje
        },
      },
    );
  }




  @Get('owner/edit-owner/:idOwner')
  @SetMetadata('roles', ['Administrador'])
  async rutaEditarOwners(
    @Query('error') error: string,
    @Param('idOwner') idOwner: string,
    @Res() res,
  ) {
    const consulta = {
      where: {
        id: idOwner,
      },
    };
    console.log(consulta)
    try {
      const arregloOwners = await this._ownerService.encontrarUno(+idOwner);
      console.log(consulta.where.id)
      if (arregloOwners) {
        res.render(
          'owner/create-owner',
          {
            datos: {error, owner: arregloOwners,
            },
          },
        );
      }else{
        res.redirect(
          '/owner/mostrar-owners?error=NO existe este owner',
        );
      }
    } catch (error) {
      console.log(error);
      res.redirect(
        '/owner/mostrar-owners?error=Error editando owner'
      )
    }

  }


  @Post(':id')
  @SetMetadata('roles', ['Administrador'])
  async actualizarUnOwner(
    @Body() owner: OwnerEntity,
    @Param('id') id: string,
    @Res() res,
  ): Promise<void> {
    const ownerUpdateDTO = new OwnerUpdateDto();
    ownerUpdateDTO.name = owner.name;
    ownerUpdateDTO.lastname = owner.lastname;
    ownerUpdateDTO.id = +id;
    const errores = await validate(ownerUpdateDTO);
    if (errores.length > 0) {
      res.redirect(
        '/owner/editar-owner/' + id + '?error=Owner no validado',
      );
    } else {
      await this._ownerService
        .actualizarUno(
          +id,
          owner,
        );
      res.redirect(
        '/owner/mostrar-owners?mensaje=El owner ' + owner.name + ' actualizado',
      );
    }

  }

  @Post('delete/:id')
  @SetMetadata('roles', ['Administrador'])
  async eliminarUnoPost(
    @Param('id') id: string,
    @Res() res,
  ): Promise<void> {
    try {

      const hijosBorrados = await this.borrarCars(+id);
      if(hijosBorrados){
        await this._ownerService
          .borrarUno(
            +id,
          );
        res.redirect(`/owner/mostrar-owners?mensaje=Owner ID: ${id} eliminado`);
      }else{
        res.redirect(`/owner/mostrar-owners?mensaje=El Owner ID: ${id} no se puede borrar porque aun no se borran sus autos`);
      }

    } catch (error) {
      console.error(error);
      res.redirect('/owner/mostrar-owners?error=Error del servidor');
    }
  }

  async borrarCars(id: number):Promise<boolean>{
    const cars = await this._ownerService.buscarCars(+id);
    try{
      for (const car of cars) {
         await this._carService.borrarUno(car.id);
      }
      return true;
    }catch (e) {
      console.log(e);
      return false;

    }
  }

  @Get('owner/mostrar-owners-cars/:idOwner')
  async buscarAutos(
    @Query('error') error: string,
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Param('idOwner') idOwner: string,
  ){
    const cars = await this._ownerService.buscarCars(+idOwner);
    if(cars.length > 0){
      res.render('car/show-search-car',
        {
          datos: {
            error,
            mensaje,
            cars, // es igual a cars:cars
            idOwner,
          },
        },
      )
    }else {
      try {
        res.redirect(
          '/owner/mostrar-owners?mensaje=El usuario no tiene cars',
        );
      }catch (e) {
        res.redirect(
          '/owner/mostrar-owners?error=Error en el servidor',
        );
      }

    }


  }

}
