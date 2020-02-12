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
import {CarService} from './car.service';
import {CarEntity} from './car.entity';
import { DeleteResult, Like } from 'typeorm';
import * as Joi from '@hapi/joi';
import {CarCreateDto} from './car.create-dto';
import {validate} from 'class-validator';
//import {CarUpdateDto} from './car.update-dto';
import { options } from 'tsconfig-paths/lib/options';
import { tryCatch } from 'rxjs/internal-compatibility';

// JS const Joi = require('@hapi/joi');

@Controller('car')
export class CarController {
  constructor(
    private readonly _carService: CarService,
  ) {

  }
}
