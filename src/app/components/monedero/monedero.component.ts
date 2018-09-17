import { Component, OnInit } from '@angular/core';
import { CajeroService } from '../../services/cajero.service';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-monedero',
  templateUrl: './monedero.component.html',
  styleUrls: ['./monedero.component.css']
})
export class MonederoComponent implements OnInit {
  listado_resultados: Array<any>;

  constructor(public _cajero: CajeroService) { }

  ngOnInit() {

    this.calcular();
  }

  async calcular() {
    let row: number;
    let denominaciones: any;
    let resultados: any;

    let monedas = await this._cajero.leer_archivo().subscribe( (data) => {
      let lineas = data.split('\n');
      this.listado_resultados = [lineas.length];
      let cuentas = lineas.slice(1, lineas.length);

      cuentas.map( (item, index) => {
        denominaciones = this._cajero.dividir_linea(item);

        resultados = this._cajero.calcular(denominaciones);

        console.log(`monto: ${denominaciones.monto} monedas: (${denominaciones.denominaciones.join(', ')}) resultado: ${resultados}`);

        // tslint:disable-next-line:max-line-length
        // this.listado_resultados.push(`monto: ${denominaciones.monto} monedas: (${denominaciones.denominaciones.join(', ')}) resultado: ${resultados}`);
        this.listado_resultados.push(`monto: ${denominaciones.monto} monedas: (${denominaciones.denominaciones.join(', ')}) resultado: ${resultados}`);
      });

    });
  }

}
