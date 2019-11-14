import { Component, OnInit } from '@angular/core';
import {formatDate } from '@angular/common';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService, NotificacionService, SolicitudService } from '../../../services/service.index';
import swal from 'sweetalert2';
import { Solicitud } from 'src/app/models/solicitud.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styles: []
})
export class SolicitudComponent implements OnInit {
  estudiantes: Usuario[] = [];
  usuario: Usuario;
  solicitud: Solicitud = new Solicitud('', '', '', '', '', '', '', '', '', '', '', '', );
  today = new Date();
  jstoday = '';
  solicitudForm: any;
  constructor(private formBuilder: FormBuilder, public _usuarioService: UsuarioService,
              public _notificacionService: NotificacionService,
              public _solicitudService: SolicitudService) {

    this.usuario = this._usuarioService.usuario;
    this.jstoday = formatDate(this.today, 'dd/MM/yyyy', 'en-US', '-0500');


    this.solicitudForm = this.formBuilder.group({
      titulo: [
        '',
        [Validators.required, Validators.maxLength(60)]
      ],
      lineaInvestigacion: [
        '',
        [Validators.required, Validators.maxLength(60)]
      ],
      codigoEstudiante1: [
        '',
        [ Validators.pattern('([0-9]){8,10}')]
      ],
      codigoEstudiante2: [
        '',
        [ Validators.pattern('([0-9]){8,10}')]
      ],
      codigoEstudiante3: [
        '',
        [ Validators.pattern('([0-9]){8,10}')]
      ],
      nombreEstudiante1: [
        ''
      ],
      nombreEstudiante2: [
        ''
      ],
      nombreEstudiante3: [
        ''
      ],
      apellidoEstudiante1: [
        ''
      ],
      apellidoEstudiante2: [
        ''
      ],
      apellidoEstudiante3: [
        ''
      ],
      pais: [
        '',
        [Validators.required]
      ],
      departamento: [
        '',
        [Validators.required]
      ],
      ciudad: [
        '',
        [Validators.required]
      ],
      duracionProyecto: [
        '',
        [Validators.required, Validators.min(4), Validators.max(12)]
      ],
      tipoProyecto: [
        '',
        [Validators.required]
      ],
      palabrasClave: [
        '',
        [Validators.required, Validators.maxLength(64)]
      ],
      resumen: [
        '',
        [Validators.required, Validators.maxLength(3000)]
      ],
    });
  }

  get titulo() {
    return this.solicitudForm.get('titulo');
  }

  get lineaInvestigacion() {
    return this.solicitudForm.get('lineaInvestigacion');
  }

  get duracionProyecto() {
    return this.solicitudForm.get('duracionProyecto');
  }

  get pais() {
    return this.solicitudForm.get('pais');
  }

  get departamento() {
    return this.solicitudForm.get('departamento');
  }

  get ciudad() {
    return this.solicitudForm.get('ciudad');
  }

  get palabrasClave() {
    return this.solicitudForm.get('palabrasClave');
  }

  get resumen() {
    return this.solicitudForm.get('resumen');
  }

  get tipoProyecto() {
    return this.solicitudForm.get('tipoProyecto');
  }

  ngOnInit() {
  }

  cargarSolicitudes() {
    this._solicitudService.cargarSolicitudes((0)).subscribe((resp: any) => {});
  }

  countChars() {
    const keywords = (document.getElementById('keyWords') as HTMLInputElement).value;
    const strLength = keywords.length;
    document.getElementById('charNum').innerHTML = strLength + '/64';
  }

  countCharsResumen() {
    const keywords = (document.getElementById('resumen') as HTMLInputElement).value;
    const strLength = keywords.length;
    document.getElementById('charNumResumen').innerHTML = strLength + '/3000';
  }

  agregarEstudiante(numDocumento: string){
    console.log("CAMBIO DE JEFE DE PROGRAMA");

    this._usuarioService.obtenerJefePrograma(numDocumento)
        .subscribe(estudiantes => {
          this.estudiantes = estudiantes
        });   

}



  notificar(forma: FormGroup) {

    swal.fire({
      title: '¿Está seguro que desea enviar la solicitud?',
      type: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Si, Aprobarlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    })
    .then(borrar => {
      
    if (borrar.value) {

      var solicitud = new Solicitud(
        forma.value.tipoModalidad,
        forma.value.titulo,
        forma.value.nombreEstudiante1 + forma.value.apellidoEstudiante1,
        forma.value.nombreEstudiante2 + forma.value.apellidoEstudiante2,
        forma.value.nombreEstudiante3 + forma.value.apellidoEstudiante3,
        forma.value.nombreConsjero1 + forma.value.apellidoConsjero1,
        forma.value.nombreConsjero2 + forma.value.apellidoConsjero2,
        forma.value.nombreConsjero3 + forma.value.apellidoConsjero3,
        "1075306358",  // Jefe de programa
        null,
        null,
        null,

        );

     


      this._solicitudService.crearSolicitud(solicitud).subscribe(resp => {
      console.log(resp);
      this.cargarSolicitudes();
      //swal.fire('Solicitud Enviada', 'La solicitud ha sido enviada.', 'success');
      });
    }

    });



  }


  
}
