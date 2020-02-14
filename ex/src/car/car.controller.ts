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
import {OwnerService} from '../owner/owner.service';
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
    private readonly _carService: CarService, private  _ownerService : OwnerService,
  ) {
  }

  @Get('mostrar-cars')
  async rutaMostrarCars(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
    @Query('consultaCar') consultaCar: string,
  ) {

    let consultaServicio;
    if (consultaCar) {
      consultaServicio = [
        {
          chassis: Like('%' + consultaCar + '%'),
        },
        {
          brand: Like('%' + consultaCar + '%'),
        },
        {
          model: Like('%' + consultaCar + '%'),
        },
        {
          color: Like('%' + consultaCar + '%'),
        },
        {
          year: Like('%' + consultaCar + '%'),
        },
        {
          price: Like('%' + consultaCar + '%'),
        },
        {
          owner: Like('%' + consultaCar + '%'),
        },
      ];
    }
    const cars = await this._carService.buscar(consultaServicio);
    console.log(cars)
    res.render('car/show-search-car',
      {
        datos: {
          error,
          mensaje,
          cars, // es igual a cars:cars
        },
      },

    );
  }


  @Post('crear')
  async crearUnCar(
    @Body() car: CarEntity,
    @Body() bodyParams ,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const carCreateDTO = new CarCreateDto();
    carCreateDTO.chassis= car.chassis;
    carCreateDTO.brand = car.brand;
    carCreateDTO.model = car.model;
    carCreateDTO.color = car.color;
    carCreateDTO.price = +car.price;
    carCreateDTO.year = car.year;

    const carOwner = await this._ownerService.encontrarUno(+bodyParams.idOwner)
    car.owner = carOwner;

    const errores = await validate(carCreateDTO);
    if (errores.length > 0) {
      console.log(errores)
      res.redirect(
        '/car/create-car?error=Error validando',
      );
    } else {
      try {
        await this._carService
          .crearUno(
            car,
          );
        res.redirect(
          '/car/create-car?mensaje=El car se creo correctamente',
        );
      } catch (error) {
        console.error(error);
        res.redirect(
          '/car/create-car?error=Error del servidor',
        );
      }
    }
  }

  @Get('create-car')
  rutaCrearCars(
    @Query('error') error: string,
    @Query('mensaje') mensaje: string,
    @Res() res,
  ) {
    res.render('car/create-car',
      {
        datos: {
          error, mensaje
        },
      },
    );
  }

  @Post('delete/:id')
  async eliminarUnoPost(
    @Param('id') id: string,
    @Res() res,
  ): Promise<void> {
    try {
      await this._carService
        .borrarUno(
          +id,
        );
      res.redirect(`/car/mostrar-cars?mensaje=Car ID: ${id} eliminado`);
    } catch (error) {
      console.error(error);
      res.redirect('/car/mostrar-cars?error=Error del servidor');
    }
  }



}
