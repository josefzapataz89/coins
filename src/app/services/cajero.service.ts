import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CajeroService {

  private lista_monedas: any;
  private band: boolean;
  private cant_monedas: number;
  private acumulador: number;


  constructor(public _http: HttpClient) {
    this.acumulador = 0;
    this.cant_monedas = 0;
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
    this.cant_monedas = 0;
    this.acumulador = 0;

    // let buena_pos = 0;
    // let buena = 9999999;
    // for (let j = 0; j < this.lista_monedas.length; j++) {
    //   let _acum: number;
    //   _acum = this.evaluar(94, j, false);

    //   if (_acum < buena) {
    //     buena = _acum;
    //     buena_pos = j;
    //   }
    // }
    // this.acumulador = this.combinaciones(94, buena_pos, false);


    for (let i = 1; i <= denominacion.monto; i++) {
      let aux: number = 0;
      let buena = 9999999;
      let buena_pos = 0;

      this.band = false;

      for (let j = 0; j < this.lista_monedas.length; j++) {
        let _acum: number;
        _acum = this.evaluar(i, j, false);

        if (_acum < buena) {
          buena = _acum;
          buena_pos = j;
        }
      }


      console.log(`monedas: (${this.lista_monedas.join(',')}) monto: ${i}`);
      aux = this.combinaciones(i, buena_pos, false);
      console.log(`cantidad monedas: ${aux}`);

      this.acumulador += aux;

      if (aux > this.cant_monedas) {
        this.cant_monedas = aux;
      }
    }

    let prom: string;

    prom = (this.acumulador / denominacion.monto).toFixed(2);

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

  private combinaciones(monto: number, index: number, bandera: boolean): number {
    let moneda: number;
    moneda = this.lista_monedas[index];

    if ( index > this.lista_monedas.length ) {
      return 0;
    }
    if (monto < 0) {
      return 0;
    }
    if (monto === 0) {
      console.log(`moneda: ${moneda}`);
      return 1;
    }


    if ( monto < moneda ) {
      let i: number;
      i = this.optimo(monto);

      let j: number;
      j = this.evaluar(monto, i, bandera);

      let k: number;
      if (bandera === false) {
        k = 1 + this.evaluar(moneda - monto, index + 1, false);
      } else {
        k = 9999;
      }
      let l: number;
      l = this.evaluar(monto, index + 1, bandera);

      // console.log(`monto: ${monto} moneda: ${moneda} j: ${j} k: ${k} l: ${l}`)

      if ( j <= k && j <= l ) {
        return this.combinaciones(monto, i, bandera);
      } else if (k <= j && k <= l && bandera === false){
        console.log(`moneda: ${moneda}`)
        console.log(`vueltos`)
        return 1 + this.combinaciones(moneda - monto, index + 1, true);
      } else if (l <= j && l <= k){
        return this.combinaciones(monto, index + 1, bandera);
      }

    } else if ( monto === moneda ) {
      return this.combinaciones(monto - moneda, index, bandera);
    } else if ( monto > moneda ) {
      // console.log(`moneda: ${moneda}`)
      // return 1 + this.combinaciones(monto - moneda, index, bandera);

      // let j: number;
      // j = 1 + this.evaluar(monto - moneda, index, bandera);

      // let l: number;
      // l = this.evaluar(monto, index + 1, bandera);

      // if (l <= j && (index + 1) <= this.lista_monedas.length) {
      //   return this.combinaciones(monto, index + 1, bandera);
      // } else if (j <= l) {
      //   return 1 + this.combinaciones(monto - moneda, index, bandera);
      // }

      // let buena = 9999999;
      // let buena_pos = index;

      // for (let j = index; j < this.lista_monedas.length; j++) {
      //   let _acum: number;
      //   _acum = this.evaluar(monto, j, false);

      //   if (_acum < buena) {
      //     buena = _acum;
      //     buena_pos = j;
      //   }
      // }

      // return this.combinaciones(monto, buena_pos, bandera);

      let b_pos: number = this.mejor_ruta(index, monto);
      console.log(`moneda: ${this.lista_monedas[b_pos]}`)
      return 1 + this.combinaciones(monto - this.lista_monedas[b_pos], b_pos, bandera);
    }
  }

  private evaluar(monto: number, index: number, bandera: boolean): number {
    if ( index > this.lista_monedas.length ) {
      return 0;
    }
    if (monto < 0) {
      return 0;
    }
    if (monto === 0) {
      return 1;
    }

    let moneda: number;
    moneda = this.lista_monedas[index];

    if ( monto < moneda ) {
      let i: number;
      i = this.optimo(monto);

      let j: number;
      j = this.evaluar(monto, i, bandera);

      let k: number;
      if (bandera === false) {
        k = this.evaluar(moneda - monto, index + 1, false) + 1;
      } else {
        k = 9999;
      }
      let l: number;
      l = this.evaluar(monto, index + 1, bandera);

      if ( j <= k && j <= l ) {
        return this.evaluar(monto, i, bandera);
      } else if (k <= j && k <= l && bandera === false){
        return 1 + this.evaluar(moneda - monto, index + 1, true);
      } else if (l <= j && l <= k){
        return this.evaluar(monto, index + 1, bandera);
      }

    } else if ( monto === moneda ) {
      return this.evaluar(monto - moneda, index, bandera);
    } else if ( monto > moneda ) {
      return 1 + this.evaluar(monto - moneda, index, bandera);

      // let j: number;
      // j = 1 + this.evaluar(monto - moneda, index, bandera);

      // let l: number;
      // l = this.evaluar(monto, index + 1, bandera);

      // if (l <= j && (index + 1) <= this.lista_monedas.length) {
      //   return this.evaluar(monto, index + 1, bandera);
      // } else if (j <= l) {
      //   return 1 + this.evaluar(monto - moneda, index, bandera);
      // }

      // let buena = 9999999;
      // let buena_pos = index;

      // for (let j = index; j < this.lista_monedas.length; j++) {
      //   let _acum: number;
      //   _acum = this.evaluar(monto, j, false);

      //   if (_acum < buena) {
      //     buena = _acum;
      //     buena_pos = j;
      //   }
      // }

      // return this.evaluar(monto, buena_pos, bandera);

      // let b_pos: number = this.mejor_ruta(index, monto);
      // return 1 + this.evaluar(monto - this.lista_monedas[b_pos], b_pos, bandera);
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

  private mejor_ruta(index: number, monto: number) {
      let buena = 9999999;
      let buena_pos = index;

      for (let j = index; j < this.lista_monedas.length; j++) {
        let _acum: number;
        _acum = this.evaluar(monto, j, false);

        if (_acum < buena) {
          buena = _acum;
          buena_pos = j;
        }
      }

      return buena_pos;
  }

}
