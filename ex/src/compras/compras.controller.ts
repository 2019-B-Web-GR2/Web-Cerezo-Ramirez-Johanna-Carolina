import { Body, Controller, Get, Param, Post, Query, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { CarService } from '../car/car.service';
import { OwnerService } from '../owner/owner.service';
import { DetailService } from '../detail/detail.service';
import { HeaderService } from '../header/header.service';
import { DetailEntity } from '../detail/detail.entity';
import { HeaderEntity } from '../header/header.entity';
import { CarEntity } from '../car/car.entity';
import { getRepository } from 'typeorm';
import { RolesGuard } from '../roles.guard';
import { empty } from 'rxjs';

@Controller('compras')
@UseGuards(RolesGuard)
export class ComprasController {
  constructor(
    private readonly _carService: CarService, private  _ownerService: OwnerService, private _detailService: DetailService, private _headerService: HeaderService
  ) {
  }

  private anadido = 0;
  private currentHeaderId = 0;
  private carsEnElCarrito:number[] = [];

  @Post('anadir-carrito/:id')
  @SetMetadata('roles', ['Usuario'])
  async anadirAlCarrito(
    @Param('id') idCar: string,
    @Body() bodyParams,
    @Res() res,
  ) {
    try {
      const car = await this._carService.encontrarUno(+idCar);
      this.carsEnElCarrito.push(+idCar);
      if(bodyParams.quantity > 0 ){
        if(this.anadido === 0){
          const header = await this.crearHeader();
          this.currentHeaderId = +header.id;
          const detail = await this.crearDetail(+car.price,+bodyParams.quantity,header,car);
          await this.updateheader(this.currentHeaderId,detail.subtotal);
          this.anadido++;
          res.redirect(
            '/car/mostrar-cars?mensaje=El carro se agrego al carrito'
          )
        }else{
          const header = await this._headerService.encontrarUno(this.currentHeaderId);
          const detail = await this.crearDetail(+car.price,+bodyParams.quantity,header,car);
          await this.updateheader(header.id,detail.subtotal);
          res.redirect(
            '/car/mostrar-cars?mensaje=El carro se agrego al carrito'
          )
        }
      }else{
        res.redirect(
          '/car/mostrar-cars?mensaje=La cantidad debe ser mayor a 0'
        )
      }
    }
    catch (e) {
      res.send("error")
      console.log(e)
    }
  }

  @Post('quitar-carrito/:id')
  @SetMetadata('roles', ['Usuario'])
  async quitarDelCarrito(
    @Param('id') idCar: string,
    @Res() res,
  ){
    console.log(idCar);
    const found = this.carsEnElCarrito.find((element) =>
    {
      return element === +idCar;
    });
    if(found != undefined){
      const details = await this.queryQuitarCarrito(+idCar,this.currentHeaderId);
      let valorARestar = 0;
      for (const detail of details) {
        valorARestar = valorARestar + detail.subtotal;
        await this._detailService.borrarUno(detail.id);
      }
      await this.restarAlTotal(this.currentHeaderId,valorARestar);
      for( let i = 0; i < this.carsEnElCarrito.length; i++){
        if ( this.carsEnElCarrito[i] === +idCar) {
          this.carsEnElCarrito.splice(i, 1);
          i--;
        }
      }
      res.redirect(
        '/car/mostrar-cars?mensaje=El carro se borro del carrito'
      )
    }else{
      res.redirect(
        '/car/mostrar-cars?mensaje=El carro no esta en el carrito'
      )
    }
  }

  @Post('comprar')
  @SetMetadata('roles', ['Usuario'])
  async comprar(
    @Body() bodyParams,
    @Res() res,
  ){
    console.log('Soy el adrressss'+bodyParams.address);
    try {
        if(this.carsEnElCarrito.length > 0){
          if(bodyParams.address != ''){
            await this.updateheader(this.currentHeaderId,0, 'comprado',bodyParams.address);
            this.anadido = 0;
            this.carsEnElCarrito = [];
            const header = await this._headerService.encontrarUno(this.currentHeaderId);
            this.currentHeaderId = 0;
            const carrosEnElCarrito:CarEntity[] = [new CarEntity()];
            carrosEnElCarrito.shift();
            const mensaje = 'Se compro con exito la siguinete factura';
            res.render(
              'compras/mostrar-carrito-compras', {datos:{
                header,
                  carrosEnElCarrito,
                  mensaje,
              }
              }
            )
          }else{
            res.redirect('/compras/ver-carrito?mensaje=No se puede comprar, ingrese una direecion valida')
          }

      }else{
          res.redirect(
            '/compras/ver-carrito?mensaje=No se puede comprar porqe el carrito esta vacio'
          )
        }
    }catch (e) {
      res.redirect('/compras/ver-carrito?error=Error del servidor')
    }
  }

  @Post('vaciar-carrito')
  @SetMetadata('roles', ['Usuario'])
  async vaciarCarrito(
    @Res() res,
  ){
    if(this.carsEnElCarrito.length > 0){
      this.anadido = 0;
      this.carsEnElCarrito = [];
      this.currentHeaderId = 0;
      res.redirect(
        '/compras/ver-carrito?mensaje=Se vacio el carrito'
      )
    }else{
      res.redirect(
        '/compras/ver-carrito?mensaje=El carrito ya esta esta vacio'
      )
    }
  }

  @Get('ver-carrito')
  @SetMetadata('roles', ['Usuario'])
  async verCarrito(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
  ){
    let header:HeaderEntity = new HeaderEntity();
    if(this.currentHeaderId != 0){
      header = await this._headerService.encontrarUno(this.currentHeaderId);
    }else{
      header.id = 0;
      header.state ='';
      header.address ='';
      header.total = 0;
    }

    const carrosEnElCarrito:CarEntity[] = [new CarEntity()];
    for (const idcar of this.carsEnElCarrito) {
        carrosEnElCarrito.push(
          await this._carService.encontrarUno(idcar)
        )
    }
    carrosEnElCarrito.shift();
    res.render('compras/mostrar-carrito-compras',
      {
        datos:{
          mensaje,
          error,
          carrosEnElCarrito,
          header,
        }
      }
    )


  }

  async queryQuitarCarrito(carId:number, headerId:number){
    return await getRepository(DetailEntity)
      .createQueryBuilder("detail")
      .where("detail.carId = :carId", { carId: carId })
      .andWhere("detail.headerId = :headerId", { headerId: headerId })
      .getMany();

  }

  async restarAlTotal(id:number, valorARestar: number){
    const header = await this._headerService.encontrarUno(id);
    header.total = header.total - valorARestar;
    await this._headerService.actualizarUno(id,header)
  }

  async crearHeader():Promise<HeaderEntity>{
    const header: HeaderEntity = new HeaderEntity();
    header.address = '';
    header.date = new Date().toISOString().substring(0,10);
    header.total = 0;
    header.state = 'creado';
    return await this._headerService.crearUno(header);

  }

  async crearDetail(price:number, quantity:number, header:HeaderEntity, car:CarEntity):Promise<DetailEntity>{
    const detail: DetailEntity = new DetailEntity();
    detail.price = price;
    detail.quantity = quantity;
    detail.subtotal = price * quantity;
    detail.header = header;
    detail.car = car;
    return await this._detailService.crearUno(detail)
  }

  async updateheader(id: number, subtotal?:number, state?:string, address?:string){
    const header = await this._headerService.encontrarUno(id);
    if(subtotal>0){
      header.total = header.total + subtotal;
    }
    if(state){
      header.state = state;
    }
    if (address){
      header.address = address;
    }
    await this._headerService.actualizarUno(id,header)
  }

}