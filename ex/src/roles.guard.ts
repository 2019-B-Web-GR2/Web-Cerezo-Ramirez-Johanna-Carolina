import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Get,
  Res,
  HttpException,
  BadRequestException, Session, Response, Redirect,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppController } from './app.controller';
import { constants } from 'http2';
import * as Http from 'http';
import * as module from 'module';
import * as http from 'http';
import { handleRetry } from '@nestjs/typeorm';
import { response } from 'express';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      try {
        const currentUserRole = request.session.usuario.roles;
        try {
          if (this.matchRoles(roles, currentUserRole)) {
            return this.matchRoles(roles, currentUserRole);
          } else if (currentUserRole[0] === 'Usuario') {
            await response.redirect('/car/mostrar-cars?error=Ud es un usuario, no tiene los permisos suficientes para acceder a este recurso')
          } else {
            await response.redirect('/owner/mostrar-owners?error=Ud es un administrador, no tiene los permisos suficientes para acceder a este recurso')
          }
        } catch (e) {
          await response.redirect('/login?error=Error del servidor')
        }
      } catch (e) {
        await response.redirect('/login?error=Debe logearse para acceder a esa pantalla')
      }
    }catch (e) {

    }
  }

  matchRoles(roles, currenUserRol): boolean {
    if(JSON.stringify(roles)==JSON.stringify(currenUserRol)){
      return true;
    }else{
        return false
      }
  }

}



