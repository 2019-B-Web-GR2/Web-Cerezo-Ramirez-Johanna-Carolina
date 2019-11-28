import { Body, Controller, Get, HttpCode, InternalServerErrorException, Param, Post, Query, Headers} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('pepito') // Decorador puede tener o no parametros. Aqui esta el segmento de la URL
export class AppController {
  constructor(private readonly appService: AppService) {
  } // http://localhost:4000/pepito/hola-inge

  // http://localhost:4000/pepito GET
  @Get('hola-inge') // -> url "/"
  getHello(): string {
    return this.appService.getHello();
  }
  // http://localhost:4000/pepito POST
  @HttpCode(200) // Aqui se define el status code que vamos a enviar
  @Post()
  adiosMundo(): string {
    const  segundos = this.obtenerSegundos();
    if (segundos % 2 === 0) {
      return 'Es par, por lo tanto: Adios mundo cruel! ';
    } else {
      throw new InternalServerErrorException(
        'Es impar',
      );
    }

  }
  private obtenerSegundos(): number { // esta funcion no se ve desde fuera del servidor porque no tiene metodos Post/Get/etc
    return new Date().getSeconds();
  }

  // Parametros de consulta
  // @ts-ignore
  @Get('bienvenida')
  public bienvenida(
    @Query() parametrosDeConsulta: ObjetoBienvenida,
    @Query('nombre') nombre: string,
    @Query('numero') numeroUsuario: number,
    @Query('casado') userCasado: boolean,
  ): string {
      console.log(parametrosDeConsulta);
      // template strings usan tildes invertidas y se escibre: `Mensaje $variable`
      return `Mensaje ${parametrosDeConsulta.nombre} Numero: ${parametrosDeConsulta.numero} Casado: ${parametrosDeConsulta.casado}`;
  }

  // Parametros de ruta
  @Get('inscripcion-curso/:idcurso/:cedula')
  public inscripcionCurso(
    @Param() parametrosDeRuta: ObjetoInscripcion,
    @Param('idCurso') idCurso: string,
    @Param('cedula') cedula: string,
  ): string {
    console.log(parametrosDeRuta);
    return `Te inscribiste al curso: ${idCurso}\n ${cedula}`;
  }

  // Body params
  @Post('almorzar')
  @HttpCode(200)
  public almorzar(
    @Body() parametrosDeCuerpo,
  ): string {
    console.log(parametrosDeCuerpo);
    return `Te inscribiste al curso ${parametrosDeCuerpo}`;
  }

  @Get('obtener-cabeceras')
  obtenerCabeceras(
    @Headers() cabeceras,
  ) {
    console.log(cabeceras);
    return `Las cabeceras son: ${cabeceras}`;
  }

}

interface ObjetoBienvenida {
  nombre?: string;
  numero?: string;
  casado?: string;
}

interface ObjetoInscripcion {
  idCurso: string;
  cedula: string;
}

// // tslint:disable-next-line:no-empty
// // Typescript
// // var nombre:string = "Adrian";
// let apellido: string = 'Eguez'; // Mutable
// const cedula: string = '1718...'; // Inmutable OK
// apellido = 'Sarzosa'; // RE ASIGNANDO "=" Mutable
// // cedula = "18"; // :( INMUTABLE - NO RE ASIGNAR
// const casado: boolean = false; // boolean
// const edad: number = 30; // number
// const sueldo: number = 12.12; // number
// let hijos = 0; // null
// hijos = null;
// let ojos; // undefined
//
// // TRUTY - FALSY
// if (0) {
//   // tslint:disable-next-line:no-console
//   console.log('Truty');
// } else {
//   // tslint:disable-next-line:no-console
//   console.log('Falsy'); // FALSY
// }
// if (-1) {
//   // tslint:disable-next-line:no-console
//   console.log('Truty'); // Truty
// } else {
//   // tslint:disable-next-line:no-console
//   console.log('Falsy');
// }
// if (1) {
//   // tslint:disable-next-line:no-console
//   console.log('Truty'); // Truty
// } else {
//   // tslint:disable-next-line:no-console
//   console.log('Falsy');
// }
// if ('') {
//   // tslint:disable-next-line:no-console
//   console.log('Truty');
// } else {
//   // tslint:disable-next-line:no-console
//   console.log('Falsy'); // Falsy
// }
// if ('abc') {
//   // tslint:disable-next-line:no-console
//   console.log('Truty'); // Truty
// } else {
//   // tslint:disable-next-line:no-console
//   console.log('Falsy');
// }
//
// if ([]) {
//   // tslint:disable-next-line:no-console
//   console.log('Truty'); // truty
// } else {
//   // tslint:disable-next-line:no-console
//   console.log('Falsy');
// }
//
// if ({}) {
//   // tslint:disable-next-line:no-console
//   console.log('Truty'); // truty
// } else {
//   // tslint:disable-next-line:no-console
//   console.log('Falsy');
// }
//
// // tslint:disable-next-line:max-classes-per-file
// class Usuario {
//   public cedula: string = '1871233';
//   cedula2 = '1871233'; // public : string
//   private holaMundo(): void {
//     // tslint:disable-next-line:no-console
//     console.log('Hola');
//   }
//   holaMundo2() {
//     // tslint:disable-next-line:no-console
//     console.log('Hola');
//   }
// }
//
// // tslint:disable-next-line:max-classes-per-file
// class User {
//   constructor(
//     public nombre: string,
//     // tslint:disable-next-line:no-shadowed-variable
//     public apellido?: string,
//   ) {
//
//   }
// }
//
// const joha = new User('Joha', 'Cerezo');
// const pau = new User('Pau');
//
// // tslint:disable-next-line:max-classes-per-file
// class Empleado extends User {
//   constructor(
//     nombre: string,
//     public numeroContrato: string,
//     // tslint:disable-next-line:no-shadowed-variable
//     apellido?: string,
//   ) {
//     super(nombre, apellido);
//   }
// }
// interface Pelota {
//   diametro: number;
//   color?: string;
// }
// const balonFutbol: Pelota = {
//   diametro: 1,
//   color: 'rojo',
// };
// interface Entrenador {
//   id: number;
//   nombre: string;
// }
// interface Pokemon {
//   id: number;
//   nombre: string;
//   entrenador: Entrenador | number;
// }
// const pikachu: Pokemon = {
//   id: 1,
//   nombre: 'Pikachu',
//   entrenador: {
//     id: 1,
//     nombre: 'Ash',
//   },
// };
// const ash: Entrenador = {
//     id: 1,
//     nombre: 'Ash',
// };
// const picaku2: Pokemon = {
//   id: 1,
//   nombre: 'Pikachu',
//   entrenador: 1,
// };
//
// const suma = pikachu.entrenador as number + pikachu.id;
// const suma2 = <number> pikachu.entrenador + pikachu.id;
