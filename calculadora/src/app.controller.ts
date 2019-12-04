import { Controller, Get, HttpCode, Query, Headers, Post, Body, Put, Delete } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // Suma
  @HttpCode(200)
  @Get('sum-headers')
  sumHeaders(
    @Headers() sumHeaders,
  ): string {
    const n1: number = +sumHeaders.number1;
    const n2: number = +sumHeaders.number2;
    const result: number = n1 + n2;
    return `El resultado de la suma es ${result}`;
  }
  // resta
  @HttpCode(201)
  @Post('substraction-body')
  substraction(
    @Body() bodyParams,
  ): string {
    // tslint:disable-next-line:no-console
    console.log(bodyParams);
    const n1: number = +bodyParams.number1;
    const n2: number = +bodyParams.number2;
    const result: number = n1 - n2;
    return `El resultado de la resta es ${result}`;
  }

  @HttpCode(202)
  @Put('multiplication-query')
  multiplication(
    @Query() queryParams,
  ): string {
    // tslint:disable-next-line:no-console
    console.log(queryParams);
    const n1: number = +queryParams.number1;
    const n2: number = +queryParams.number2;
    const result: number = n1 * n2;
    return `El resultado de la multiplicación es ${result}`;
  }

  @HttpCode(203)
  @Delete('division-query')
  division(
    @Query() queryParams,
    @Body() bodyParams,
    @Headers() headerParams,
  ): string {
    // tslint:disable-next-line:no-console
    console.log(queryParams);
    const n1: number = +queryParams.number1;
    const n2: number = +queryParams.number2;
    const result: number = n1 / n2;

    const n3: number = +bodyParams.number1;
    const n4: number = +bodyParams.number2;
    const result2: number = n3 / n4;

    const n5: number = +headerParams.number1;
    const n6: number = +headerParams.number2;
    const result3: number = n5 / n6;

    return `El resultado de la división con query es ${result}
            El resultado de la división con body es ${result2}
            El resultado de la división con heather es ${result3}
    `;


  }
}
