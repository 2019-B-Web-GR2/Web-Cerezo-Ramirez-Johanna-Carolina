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
  Session,
  UnauthorizedException,
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

// JS const Joi = require('@hapi/joi');

@Controller('owner')
export class OwnerController {
  constructor(
    private readonly _ownerService: OwnerService,
  ) {

  }


  @Get('mostrar-owners')
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
  async crearUnOwner(
    @Body() owner: OwnerEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const ownerCreateDTO = new OwnerCreateDto();
    ownerCreateDTO.name = owner.name;
    ownerCreateDTO.lastname = owner.lastname;
    ownerCreateDTO.idCard = owner.idCard;
    console.log(owner.name, owner.lastname, owner.idCard)
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
  async eliminarUnoPost(
    @Param('id') id: string,
    @Res() res,
  ): Promise<void> {
    try {
      await this._ownerService
        .borrarUno(
          +id,
        );
      res.redirect(`/owner/mostrar-owners?mensaje=Owner ID: ${id} eliminado`);
    } catch (error) {
      console.error(error);
      res.redirect('/owner/mostrar-owners?error=Error del servidor');
    }



  }





}
