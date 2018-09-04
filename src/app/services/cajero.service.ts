import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CajeroService {

  private lista_monedas: any;
  private bandera: boolean;
  private cant_monedas: number;
  private acumulador: number;


  constructor(public _http: HttpClient) {
    this.acumulador = 0;
    this.cant_monedas = 0;
    this.bandera = true;
  }

  leer_archivo() {
    // lectura de archivo
    // return this._http.get('assets/input.txt', { responseType: 'text' });
    return this._http.get('assets/test.txt', { responseType: 'text' });
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
    this.acumulador = 0;

    for (let i = 1; i <= denominacion.monto; i++) {
      let aux: number = 0;

      aux = this.combinaciones(i, 0);

      console.log(`(valores: ${this.lista_monedas.join(',')}) monto: ${i} monedas: ${aux}`);
      this.acumulador += aux;

      if (aux > this.cant_monedas) {
        this.cant_monedas = aux;
      }
    }

    let prom: number;

    prom = (this.acumulador / denominacion.monto).toFixed(3);

    return `${prom} ${this.cant_monedas}`;
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
      let j: number;
      let k: number;
      let l: number;

      i = this.optimo(monto);
      j = this.combinaciones(monto, i);
      k = this.combinaciones(monto, index + 1);
      l = this.combinaciones(moneda - monto, index + 1) + 1;

      if ( j <= k && j <= l ) {
        return this.combinaciones(monto, i);
      } else if ( k < j && k < l ) {
        return this.combinaciones(monto, index + 1);
      } else if ( l < k && l < j ) {
        if (this.bandera) {
          this.bandera = false;
          return this.combinaciones(moneda - monto, index) + 1;
        } else {
          i = this.optimo(monto);
          j = this.combinaciones(monto, i);
          k = this.combinaciones(monto, index + 1);

          if (j <= k) {
            return this.combinaciones(monto, i);
          } else {
            return this.combinaciones(monto, index + 1);
          }
        }
      }

    } else if ( monto === moneda ) {
      return 1;
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
