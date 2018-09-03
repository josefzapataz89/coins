import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { truncate } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class CajeroService {

  private lista_monedas: any;
  private bandera: boolean;
  private cant_monedas: number;


  constructor(public _http: HttpClient) { }

  leer_archivo() {
    // lectura de archivo
    return this._http.get('assets/input.txt', { responseType: 'text' });
    // return this._http.get('assets/test.txt', { responseType: 'text' });
  }

  dividir_linea(cadena: string) {
    let data: Array<string>;
    let monto: number;
    let tipos: number;

    let denominaciones: Array<number> = [];

    // console.log(`cadena: ${cadena} `);

    data = cadena.split(' ');

    monto = Number(data[0]);
    tipos = Number(data[1]);

    data.map( (denominacion, index) => {
      if ( index >= 2 ) {
        denominaciones.push(Number(denominacion));
      }
    });

    // console.log(`monto: ${monto} tipos: ${tipos} denominaciones: `, denominaciones);

    return {
      monto,
      tipos,
      denominaciones
    };
  }

  calcular(denominacion: any) {
    this.lista_monedas = denominacion.denominaciones.sort(this.ascendente);
    this.bandera = true;
    this.cant_monedas = 0;

    return this.combinaciones(denominacion.monto, 0);
  }
  private descendente(a: number, b: number) {
    let comparacion = 0;

    if (Number(b) > Number(a)) {
      comparacion = -1;
    }
    else if (Number(a) > Number(b)) {
      comparacion = 1;
    }

    return comparacion;
  }
  private ascendente(a: number, b: number) {
    let comparacion = 0;

    if (Number(b) < Number(a)) {
      comparacion = -1;
    }
    else if (Number(a) < Number(b)) {
      comparacion = 1;
    }

    return comparacion;
  }

  private combinaciones(monto: number, index: number): number {
    let moneda: number;
    moneda = this.lista_monedas[index];

    if ( monto < 0) {
      return 0;
    }

    if ( monto === 0) {
      return 0;
    }

    if ( index === this.lista_monedas.length && monto > 0 ) {
      return 0;
    }

    if ( monto > moneda ) {
      return this.combinaciones(monto - moneda, index) + 1;
    } else if ( monto < moneda ) {

      let i: number;

      i = this.optimo(monto);

      return this.combinaciones(monto, i);
    } else if ( monto === moneda ) {
      return this.combinaciones(monto - moneda, index) + 1;
    }

  }

  private optimo(monto: number): number {
    let pos: any;
    let nuevo: any;
    let diff: any;

    diff = this.lista_monedas.map( (a, b) => {
      return Math.floor(monto / a);
    });

    nuevo = diff.filter( (a, b) => {
      return (a > 0);
    });

    pos = diff.indexOf(nuevo[0]);

    return pos;
  }

}
