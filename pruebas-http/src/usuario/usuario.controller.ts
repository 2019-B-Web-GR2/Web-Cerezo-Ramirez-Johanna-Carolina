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
import {UsuarioService} from './usuario.service';
import {UsuarioEntity} from './usuario.entity';
import { DeleteResult, Like } from 'typeorm';
import * as Joi from '@hapi/joi';
import {UsuarioCreateDto} from './usuario.create-dto';
import {validate} from 'class-validator';
import {UsuarioUpdateDto} from './usuario.update-dto';
import { options } from 'tsconfig-paths/lib/options';
import { tryCatch } from 'rxjs/internal-compatibility';

// JS const Joi = require('@hapi/joi');

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly _usuarioService: UsuarioService,
  ) {

  }
  @Get('ejemplo-ejs')
  ejemploejs(
    @Res() res,
  ) {
    res.render('ejemplo', {
      datos: {
      nombre: 'Adrian',
        suma: this.suma, // definicion de la funcion
        joi: Joi,
      },
    });
  }

  suma(numUno, numDos) {
    return numUno + numDos;
  }

  @Get('ruta/mostrar-usuarios')
  async rutaMostrarUsuarios(
    @Res() res,
    @Query('mensaje') mensaje: string,
    @Query('error') error: string,
    @Query('consultaUsuario') consultaUsuario: string,
  ) {
    let consultaServicio;
    if (consultaUsuario) {
      consultaServicio = [
        {
          nombre: Like('%' + consultaUsuario + '%'),
        },
        {
          cedula: Like('%' + consultaUsuario + '%'),
        },
      ];
    }
    const usuarios = await this._usuarioService.buscar(consultaServicio);
    res.render('usuario/rutas/buscar-mostrar-usuario',
      {
        datos: {
          error,
          mensaje,
          usuarios, // es igual a usuarios:usuarios
        },
      },
    );
  }

  @Get('ruta/crear-usuarios')
  rutaCrearUsuarios(
    @Query('error') error: string,
    @Res() res,
      ) {
    res.render('usuario/rutas/crear-usuario',
      {
        datos: {
          error,
        },
      },
    );
  }

  @Get('ruta/editar-usuarios/:idUsuario')
  async rutaEditarUsuarios(
    @Query('error') error: string,
    @Param('idUsuario') idUsuario: string,
    @Res() res,
  ) {
    const consulta = {
      where: {
        id: idUsuario,
      },
  };
    try {
      const arregloUsuarios = await this._usuarioService.buscar(consulta);
      if (arregloUsuarios.length > 0) {
        res.render(
          'usuario/rutas/crear-usuario',
          {
            datos: {error, usuario: arregloUsuarios[0],
            },
          },
        );
      }else{
        res.redirect(
          '/usuario/rutas/mostrar-usuarios?error=NO existe este usuario',
        );
      }
    } catch (error) {
      console.log(error);
      res.redirect(
        '/usuario/rutas/mostrar-usuarios?error=Error editando usuario'
      )
    }

  }

  @Post('login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Session() session,
  ) {
    console.log('Session', session);
    if (username === 'adrian' && password === '1234') {
      session.usuario = {
        nombre: 'adrian',
        userId: 1,
        roles: ['Administrador'],
      };
      return 'ok';
    }
    if (username === 'vicente' && password === '1234') {
      session.usuario = {
        nombre: 'vicente',
        userId: 2,
        roles: ['Supervisor'],
      };
      return 'ok';
    }
    throw new BadRequestException('No envia credenciales');
  }

  @Get('sesion')
  sesion(
    @Session() session,
  ) {
    return `
    <html>
            <head> <title>EPN</title> </head>
            <body>
            <h1> Mi primera pagina web ${session.usuario ? session.usuario.nombre : 'No definido'} </h1>
    </body>
    </html>`;
  }

  @Get('logout')
  logout(
    @Session() session,
    @Req() req,
  ) {
    session.usuario = undefined;
    req.session.destroy();
    return 'Deslogueado';
  }
  @Get('hola')
  hola(): string {
    return `
<html>
        <head> <title>EPN</title> </head>
        <body>
        <h1> Mi primera pagina web </h1>

</body>
</html>`;
  }

  // GET /modelo/:id
  @Get(':id')
  obtenerUnUsuario(
    @Param('id') identificador: string,
  ): Promise<UsuarioEntity | undefined> {
    return this._usuarioService
      .encontrarUno(
        Number(identificador),
      );
  }

  @Post()
  async crearUnUsuario(
    @Body() usuario: UsuarioEntity,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const administrador = session.usuario.roles.find(
      rol => {
        return rol === 'Administrador';
      },
    );
    if (!administrador) {
      throw new BadRequestException('Error usted no cuenta con los suficientes permisos');
    }
    const usuarioCreateDTO = new UsuarioCreateDto();
    usuarioCreateDTO.nombre = usuario.nombre;
    usuarioCreateDTO.cedula = usuario.cedula;
    const errores = await validate(usuarioCreateDTO);
    if (errores.length > 0) {
      res.redirect(
       '/usuario/ruta/crear-usuarios?error=Error validando',
      );
     // throw new BadRequestException('Error validando');
    } else {
      try {
        await this._usuarioService
          .crearUno(
            usuario,
          );
        res.redirect(
          '/usuario/ruta/crear-usuarios?error=Error validando',
        );
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(error);
      }
      }
  }

  @Post(':id')
  async actualizarUnUsuario(
    @Body() usuario: UsuarioEntity,
    @Param('id') id: string,
    @Res() res,
    @Session() session,
  ): Promise<void> {
    const rol = session.usuario.roles.find(
      rol => {
        return (rol === 'Administrador' || rol === 'Supervisor');
      },
    );

    if (!rol) {
      throw new BadRequestException('Error usted no cuenta con los suficientes permisos');
    }
    const usuarioUpdateDTO = new UsuarioUpdateDto();
    usuarioUpdateDTO.nombre = usuario.nombre;
    usuarioUpdateDTO.cedula = usuario.cedula;
    usuarioUpdateDTO.id = +id;
    const errores = await validate(usuarioUpdateDTO);
    if (errores.length > 0) {
      res.redirect(
        '/usuario/ruta/editar-usuarios/' + id + '?error=Usuario no validado'
      );
    } else {
      await  this._usuarioService
        .actualizarUno(
          +id,
          usuario,
      );
      res.render(
        '/usuario/ruta/mostar-usuarios?mensaje=El usuario' + id + 'ha sido acutializado',
      );
    }

  }
  @Post(':id')
  async eliminarUnoPost(
    @Param('id') id: string,
    @Res() res,
  ): Promise<void> {
    try {
      await this._usuarioService
        .borrarUno(
          +id,
        );
      res.redirect(`/usuario/ruta/mostrar-usuarios?mensaje=Usuario ID: ${id} eliminado`);
    } catch (error) {
      console.error(error);
      res.redirect(`/usuario/ruta/mostrar-usuarios?error=Error del servidor`);
    }
  }

  @Delete(':id')
  eliminarUno(
    @Param('id') id: string,
    @Session() session,
  ): Promise<DeleteResult> {
    const rol = session.usuario.roles.find(
      rol => {
        return rol === 'Administrador';
      },
    );
    if (!rol) {
      throw new BadRequestException('Error usted no cuenta con los suficientes permisos');
    }
    return this._usuarioService
      .borrarUno(
        +id,
      );
  }

  @Get()
  async buscar(
    @Query('skip') skip?: string | number,
    @Query('take') take?: string | number,
    @Query('where') where?: string,
    @Query('order') order?: string,
  ): Promise<UsuarioEntity[]> {
    if (order) {
      try {
        order = JSON.parse(order);
      } catch (e) {
        order = undefined;
      }
    }
    if (where) {
      try {
        where = JSON.parse(where);
      } catch (e) {
        where = undefined;
      }
    }
    if (skip) {
      skip = +skip;
      // const nuevoEsquema = Joi.object({
      //     skip: Joi.number()
      // });
      // try {
      //     const objetoValidado = await nuevoEsquema
      //         .validateAsync({
      //             skip: skip
      //         });
      //     console.log('objetoValidado', objetoValidado);
      // } catch (error) {
      //     console.error('Error',error);
      // }
    }
    if (take) {
      take = +take;
    }
    return this._usuarioService
      .buscar(
        where,
        skip as number,
        take as number,
        order,
      );
  }

}
