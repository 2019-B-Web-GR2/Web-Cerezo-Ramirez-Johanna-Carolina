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
import {validate} from 'class-validator';
import * as Joi from '@hapi/joi';
//import {OwnerUpdateDto} from './owner.update-dto';
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

  @Post('crear')
  async crearUnOwner(
    @Body() owner: OwnerEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    console.log('holiiiiiiiiiiiiiiiiiiiiiiiiii')
    const ownerCreateDTO = new OwnerCreateDto();
    ownerCreateDTO.name = owner.name;
    ownerCreateDTO.lastname = owner.lastname;
    ownerCreateDTO.idCard = owner.idCard;
    const errores = await validate(ownerCreateDTO);
    if (errores.length > 0) {
       throw new BadRequestException('Error validando');
    } else {
      try {
        await this._ownerService
          .crearUno(
            owner,
          );
        res.send('ok')
      } catch (error) {
        console.error(error);
      }
    }
  }

  @Get('mostrar-duenos')
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

  @Get('owner/create-owner')
  rutaCrearOwners(
    @Query('error') error: string,
    @Res() res,
  ) {
    res.render('owner/create-owner',
      {
        datos: {
          error,
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
      const arregloOwners = await this._ownerService.buscarPorID(consulta);
      console.log(arregloOwners)
      if (arregloOwners.length > 0) {
        res.render(
          'owner/create-owner',
          {
            datos: {error, owner: arregloOwners[0],
            },
          },
        );
      }else{
        res.redirect(
          '/owner/rutas/mostrar-owners?error=NO existe este owner',
        );
      }
    } catch (error) {
      console.log(error);
      res.redirect(
        '/owner/rutas/mostrar-owners?error=Error editando owner'
      )
    }

  }


}
