import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CajeroService {

  constructor(public _http: HttpClient) { }

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
}
