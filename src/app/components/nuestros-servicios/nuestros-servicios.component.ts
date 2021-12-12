import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nuestros-servicios',
  templateUrl: './nuestros-servicios.component.html',
  styleUrls: ['./nuestros-servicios.component.scss'],
})
export class NuestrosServiciosComponent implements OnInit {
items = [{
  id: 'vaccines',
  name: 'Estudios'
},
{
  id: 'percent',
  name: 'Promociones'
},
{
  id: 'find_in_page',
  name: 'Resultados'
},
{
  id: 'description',
  name: 'Facturación'
},
{
  id: 'location_on',
  name: 'Sucursales'
}]
  constructor() { }

  ngOnInit() {}

}
