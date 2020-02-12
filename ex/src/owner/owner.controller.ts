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

// JS const Joi = require('@hapi/joi');

@Controller('owner')
export class OwnerController {
  constructor(
    private readonly _ownerService: OwnerService,
  ) {

  }
}
