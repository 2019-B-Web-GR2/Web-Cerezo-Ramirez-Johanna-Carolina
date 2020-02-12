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

}
