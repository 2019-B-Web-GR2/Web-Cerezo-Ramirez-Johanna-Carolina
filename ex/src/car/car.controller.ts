import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  Session, SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CarService } from './car.service';
import { OwnerService } from '../owner/owner.service';
import { CarEntity } from './car.entity';
import { Like } from 'typeorm';
import { CarCreateDto } from './car.create-dto';
import { validate } from 'class-validator';
//import {CarUpdateDto} from './car.update-dto';
import { CarUpdateDto } from './car.update-dto';
import { DetailService } from '../detail/detail.service';
import { HeaderEntity } from '../header/header.entity';
import { DetailEntity } from '../detail/detail.entity';
import { HeaderService } from '../header/header.service';
import { RolesGuard } from '../roles.guard';


// JS const Joi = require('@hapi/joi');

@Controller('car')
@UseGuards(RolesGuard)
export class CarController {
  constructor(
    private readonly _carService: CarService, private  _ownerService: OwnerService, private _detailService: DetailService, private _headerService: HeaderService
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
      ];
    }
    const cars = await this._carService.buscar(consultaServicio);
    const carService = this._carService;
    res.render('car/show-search-car',
      {
        datos: {
          error,
          mensaje,
          cars, // es igual a cars:cars
          carService
        },
      },
    );
  }


  @Post('crear')
  @SetMetadata('roles', ['Administrador'])
  async crearUnCar(
    @Body() car: CarEntity,
    @Body() bodyParams,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const carCreateDTO = new CarCreateDto();
    carCreateDTO.chassis = car.chassis;
    carCreateDTO.brand = car.brand;
    carCreateDTO.model = car.model;
    carCreateDTO.color = car.color;
    carCreateDTO.price = +car.price;
    carCreateDTO.year = car.year;

    const carOwner = await this._ownerService.encontrarUno(+bodyParams.idOwner)
    car.owner = carOwner;
    carCreateDTO.owner = car.owner;
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
  @SetMetadata('roles', ['Administrador'])
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

  @Get('/edit-car/:idCar')
  @SetMetadata('roles', ['Administrador'])
  async rutaEditarCars(
    @Query('error') error: string,
    @Param('idCar') idCar: string,
    @Res() res,
  ) {
    const consulta = {
      where: {
        id: idCar,
      },
    };
    const carOwner = await this._carService.buscarOwner(+idCar);
    try {
      const arregloCars = await this._carService.encontrarUno(+idCar);

      if (arregloCars) {
        res.render(
          'car/create-car',
          {
            datos: {
              error, car: arregloCars, carOwner
            },
          },
        );
      } else {
        res.redirect(
          '/car/mostrar-cars?error=NO existe este car',
        );
      }
    } catch (error) {
      console.log(error);
      res.redirect(
        '/car/mostrar-cars?error=Error editando car'
      )
    }

  }


  @Post(':id')
  @SetMetadata('roles', ['Administrador'])
  async actualizarUnCar(
    @Body() car: CarEntity,
    @Param('id') id: string,
    @Body() bodyParams,
    @Res() res,
  ): Promise<void> {
    const carUpdateDTO = new CarUpdateDto();
    carUpdateDTO.chassis = car.chassis;
    carUpdateDTO.brand = car.brand;
    carUpdateDTO.model = car.model;
    carUpdateDTO.color = car.color;
    carUpdateDTO.year = car.year;
    carUpdateDTO.price = +car.price;
    const carOwner = await this._ownerService.encontrarUno(+bodyParams.idOwner);
    car.owner = carOwner;
    carUpdateDTO.owner = car.owner;

    const errores = await validate(carUpdateDTO);
    if (errores.length > 0) {
      res.redirect(
        '/car/editar-car/' + id + '?error=Car no validado',
      );
      console.log(errores)
    } else {
      await this._carService
        .actualizarUno(
          +id,
          car,
        );
      res.redirect(
        '/car/mostrar-cars?mensaje=El car ' + car.chassis + ' actualizado',
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
