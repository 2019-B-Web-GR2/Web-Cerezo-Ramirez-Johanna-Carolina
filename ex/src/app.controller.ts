import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, Res, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { HeaderEntity } from './header/header.entity';
import { DetailEntity } from './detail/detail.entity';
import { CarService } from './car/car.service';
import { HeaderService } from './header/header.service';
import { DetailService } from './detail/detail.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('login')
  login(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
  ) {
    res.render('./session/login',{
        datos: {
          mensaje,
          error
        }
      }

    );
  }

  @Post('login')
  async authenticate(
    @Body('username') username: string,
    @Body('password') password: string,
    @Session() session,
    @Res() res,
  ) {
    try {
      if (username === 'johanna' && password === '1234') {
        session.usuario = {
          nombre: 'johanna',
          userId: 1,
          roles: ['Administrador'],
        };
        res.redirect('owner/mostrar-owners')
      }
      if (username === 'carolina' && password === '1234') {
        session.usuario = {
          nombre: 'Carolina',
          userId: 2,
          roles: ['Usuario'],
        };
        res.redirect('car/mostrar-cars')
      }
      if (username === '' || password === '') {
        res.redirect('/login?error=No envia credenciales validas')
      }
    } catch (e) {
      res.redirect('/login?error=Error del serrvidor')
    }
  }

  @Get('rol')
  async rol(
    @Session() session,
    @Res() res,
  ) {
    return session.usuario.roles;
  }

  @Get('logout')
  logout(
    @Session() session,
    @Req() req,
    @Res() res,
  ) {
    session.usuario = undefined;
    req.session.destroy();
    res.redirect('/login?mensaje=Ha cerrado sesion')
  }







}
