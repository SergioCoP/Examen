var pokemones = [];
var registrosuser = [];

var idusuarios;

var dName = document.getElementById("nombre");
var dLastname = document.getElementById("apellidopaterno");
var dLastname1 = document.getElementById("apellidomaterno");
var dListPkm = document.getElementById("pkmfovorito");
var dIduser = document.getElementById("iduser");


var btnAgregar = $("#btnAgregar");
var btnGuardar = $("#btnGuardar");

var formularioUsuario = $("#formUser");
var titulo = $("#titulo");
var modal = $('#addUser');

var cont=0;

const llenarTabla = () =>{
let table = "";

if(registrosuser.length > 0){
    for(let i =0; i < registrosuser.length; i++){
        table += `
        <tr data-matricula="${registrosuser[i].id}"">
				<td>${ i + 1 }</td>
				<td>${registrosuser[i].nombre}</td>
				<td>${registrosuser[i].apellidopaterno} ${registrosuser[i].apellidomaterno}</td>
				<td>${registrosuser[i].pokemonfavorito}</td>
				<td>
					<button type="button" class="btn btn-info ver" data-bs-toggle="modal" data-bs-target="#addUser">Ver</button>
					<button type="button" class="btn btn-primary modificar" data-bs-toggle="modal" data-bs-target="#addUser">Modificar</button>
					<button type="button" class="btn btn-danger eliminar">Eliminar</button>
				</td>
			</tr>
        `;
    }
}else{
    table = `
		<tr class="text-center">
			<td colspan="5">No hay usuarios ha mostrar</td>
		</tr>
		`;
}
$(".tabla-usuario > tbody").html(table);
};

const cargarDatos = () => {
    if(typeof (Storage) !== "undefined"){
        if(!localStorage.listausuarios){
            localStorage.listausuarios = JSON.stringify([]);
        }

        registrosuser = JSON.parse(localStorage.listausuarios);
        llenarTabla();
    }else{
        alert("Navegador no soporta almacenamiento en web");
    }
}

const guardarDatosUsers = () =>{
    let usuario = new Object();
    usuario.id = cont+=1;
    usuario.nombre = dName.value;
    usuario.apellidopaterno = dLastname.value;
    usuario.apellidomaterno = dLastname1.value;
    usuario.pokemonfavorito = dListPkm.value;

    registrosuser.push(usuario);
    localStorage.listausuarios = JSON.stringify(registrosuser);

    return true;
}


const modificarDatosUsers = () =>{
    let matricula = $("#iduser").val();
    let res = "Error";

    if(confirm(`¿Seguro de modificar al usuario con identificador ${matricula}?`)){
        for(let i = 0; i < registrosuser.length; i++){
            if(registrosuser[i].id === idusuarios){
                registrosuser[i].nombre = dName.value;
                registrosuser[i].apellidopaterno = dLastname.value;
                registrosuser[i].apellidomaterno = dLastname1.value;
                registrosuser[i].pokemonfavorito = dListPkm.value;
                res = "Agregado";
            }
        }
    }else{
        res="Cancelado";
    }
    

    localStorage.listausuarios = JSON.stringify(registrosuser);
    return res;
}


const eliminarUsers = (id) =>{
    let flag = false;

    for(let i = 0; i < registrosuser.length; i++){
        if(registrosuser[i].id === id){
            registrosuser.splice(i,1);
            flag = true;
            break;
        }
    }

    localStorage.listausuarios = JSON.stringify(registrosuser);
    return flag;
}


const copiarDatosFormulario = (id) => {
    for(let i = 0; i < registrosuser.length; i++){
        if(registrosuser[i].id === id){
            
            dIduser.value = registrosuser[i].id;
            dName.value = registrosuser[i].nombre;
            dLastname.value = registrosuser[i].apellidopaterno;
            dLastname1.value = registrosuser[i].apellidomaterno;
            dListPkm.value = registrosuser[i].pokemonfavorito;
            break;
        }
    }

	return true;	
}


const limpiarFormulario = () => {
	document.getElementById("formUser").reset(); 
}


const findPokemons = () =>{
    $.ajax({
        type: 'GET',
        url: 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=100' ,
        dataType: 'json'
    }).done(function(response){
        pokemones = response.results;
        console.log(pokemones);
        $.each(pokemones, function(i,item){
            console.log(item.name);
            $('#pkmfovorito').append('<option value = '+ item.name +'>'+ item.name +'</option>');
        })
       
    })
   
}

const mostrarOcultarCampos = () => {
    if (titulo.text().indexOf("Información") === -1) {
        $("#nombre").removeAttr("disabled");
        $("#apellidopaterno").removeAttr("disabled");
        $("#apellidomaterno").removeAttr("disabled");
        $("#pkmfovorito").removeAttr("disabled");
    } else {
        $("#nombre").attr("disabled", "disabled");
        $("#apellidopaterno").attr("disabled", "disabled");
        $("#apellidomaterno").attr("disabled", "disabled");
        $("#pkmfovorito").attr("disabled", "disabled");
    }
}

$(document).ready(function(){
	btnGuardar.attr("disabled","disabled");

	btnAgregar.click(function(){
		if(guardarDatosUsers()){
			showAlert("¡Éxito!", "Usuario agregado correctamente.");
		}else{
			showAlert("¡Error!", "Error al guardar usuario");
		}
		modal.modal('hide');
		llenarTabla();
	});

	btnGuardar.click(function(){
		let modificar = modificarDatosUsers();

		if(modificar === "Agregado"){
			modal.modal('hide');
			showAlert("¡Éxito!", "Usuario modificado correctamente.");
		}else if(modificar === "Error"){
			showAlert("¡Error!", "Error al modificar usuario");
		}
		llenarTabla();
	});

	$("#agregar").click(function(){
        findPokemons();
		btnAgregar.show();
		btnGuardar.hide();
		limpiarFormulario(formularioUsuario);
		titulo.text("Registro de Jugadores");

        mostrarOcultarCampos();
	});

	$(document).on("click", ".ver, .modificar", function(){
        findPokemons();
		let botonTexto = $(this).text();
		let matricula = $(this).parent().parent().data("matricula");
		idusuarios =  matricula;
		
		btnAgregar.hide();
		if(botonTexto === "Modificar"){
			btnGuardar.show();
			btnGuardar.text("Modificar");
			titulo.text("Modificar usuario con identificador " + matricula);
		}else{
			btnGuardar.hide();
			titulo.text("Información del usuario con identificador " + matricula);	
		}
		
		mostrarOcultarCampos();
        
		if(copiarDatosFormulario(matricula)){
				btnGuardar.removeAttr("disabled");	
		}
	});

	$(document).on("click",".eliminar",function(){
		let matricula = $(this).parent().parent().data("matricula");
		let confirmarEliminar = confirm(`¿Estás seguro de eliminar al usuario con identificador ${matricula}?`);

		if(confirmarEliminar){
			$(this).parent().parent().remove();			
			if(eliminarUsers(matricula)){
				showAlert("¡Éxito!", `Usuario con identificador ${matricula} eliminado correctamente.`);
			}else{
				showAlert("¡Error!", "No se pudo eliminar al usuario.");
			}
		}
	});
});