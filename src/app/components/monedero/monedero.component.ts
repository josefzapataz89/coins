import { Component, OnInit } from '@angular/core';
import { CajeroService } from '../../services/cajero.service';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-monedero',
  templateUrl: './monedero.component.html',
  styleUrls: ['./monedero.component.css']
})
export class MonederoComponent implements OnInit {

  constructor(public _cajero: CajeroService) { }

  ngOnInit() {

    this.calcular();
  }

  async calcular() {
    let row: number;
    let denominaciones: Array<number>;

    let monedas = await this._cajero.leer_archivo().subscribe( (data) => {
      let lineas = data.split('\n');
      let cuentas = lineas.slice(1, lineas.length);

      cuentas.map( (item, index) => {
        denominaciones = this._cajero.dividir_linea(item);

        console.log('respuesta: ', denominaciones);
      });

    });
  }

}
