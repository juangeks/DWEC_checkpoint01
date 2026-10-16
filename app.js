// Constantes con los elementos del DOM
const nombre = document.getElementById("cliente");
const matricula = document.getElementById("matricula");
const vehiculo = document.getElementById("vehiculo");

const aceite = document.getElementById("aceite");
const filtros = document.getElementById("filtros");
const frenos = document.getElementById("frenos");
const neumaticos = document.getElementById("neumaticos");
const alineado = document.getElementById("alineado");

const pago = document.getElementById("pago");

const btnPresupuesto = document.getElementById("btnPresupuesto");

const divPresupuesto = document.getElementById("presupuesto");
const mensaje = document.getElementById("mensaje");
const mensajeTotal = document.getElementById("total");

// Constantes de cálculo
const MULTMOTO = 0.7;
const MULTTURISMO = 1;
const MULTSUV = 1.2;
const MULTFURGONETA = 1.35;

const DESCUENTO10 = 0.10;
const DESCUENTO5 = 0.05;

const RECARGOFINANCIACION = 0.05;

const IVA = 0.21;

// Catálogo de servicios: el id coincide con el id del input del HTML
const SERVICIOS = [
  { id: "aceite", nombre: "Cambio de aceite", precio: 45 },
  { id: "filtros", nombre: "Cambio de filtros", precio: 30 },
  { id: "frenos", nombre: "Pastillas de freno (eje)", precio: 80 },
  { id: "neumaticos", nombre: "Neumático", precio: 70 },
  { id: "alineado", nombre: "Alineado de dirección", precio: 35 }
];

// Añadir evento al botón de presupuesto
btnPresupuesto.addEventListener('click', () => {
    generarPresupuesto();
});

//***** FUNCIONES *****/

function generarPresupuesto() {
  try {
    if(verificacionDatos()) {

      let base = 0;
      let servicios = new Array();

      if(aceite.value != 0) {
        base += calcularServicio("aceite", aceite.value);
        servicios.push({servicio: "aceite", cantidad: aceite.value})
      }
      if(filtros.value != 0) {
        base += calcularServicio("filtros", filtros.value);
        servicios.push({servicio: "filtros", cantidad: filtros.value})
      }
      if(frenos.value != 0) {
        base += calcularServicio("frenos", frenos.value);
        servicios.push({servicio: "frenos", cantidad: frenos.value})
      }
      if(neumaticos.value != 0) {
        base += calcularServicio("neumaticos", neumaticos.value);
        servicios.push({servicio: "neumatico", cantidad: neumaticos.value})
      }
      if(alineado.value != 0) {
        base += calcularServicio("alineado", alineado.value);
        servicios.push({servicio: "alineado", cantidad: alineado.value})
      }



      let baseConDescuento = aplicarDescuento(base); // Se le aplica el descuento pertinente

      let conRecargo = 0;

      if(pago.value == "financiado") // Se comprueba si el pago está financiado
        conRecargo = baseConDescuento * RECARGOFINANCIACION;

      
      let baseConIva = baseConDescuento * IVA;

      
      let total = baseConDescuento + conRecargo + IVA

      divPresupuesto.innerHTML = `<h1>Presupuesto para ${nombre.value} - ${matricula.value}</h1><br> <p>Servicio - Cantidad - Importe</p>`;
      
      for (let i = 0; i < servicios.length; i++) {
          let servicio = new Object();
          let cont = 0;

          do {
              servicio = SERVICIOS[cont];

              cont++
          } while(cont<SERVICIOS.length && servicio.id != servicios[i].servicio)

          divPresupuesto.innerHTML += `${servicio.nombre} - ${servicios[i].cantidad} - ${(servicios[i].cantidad * servicio.precio)}&euro;<br>`;
        

      }

      divPresupuesto.innerHTML += `<p>Base (vehículo x${obtenerMultiplicador(vehiculo.value)}): ${base}&euro;</p>`;
      divPresupuesto.innerHTML += `<p>Descuento (${obtenerDescuento(base)}%): -${(base*obtenerDescuento(base))/100}&euro;</p>`;
      divPresupuesto.innerHTML += `<p>Recargo por pago (${pago.value=="financiado"?"5":"0"}%): +${conRecargo}&euro;</p>`;
      divPresupuesto.innerHTML += `<p>IVA (${IVA*100}%): +${(baseConDescuento*(IVA*100))/100}&euro;</p>`;


      mensajeTotal.value = total + " €";

    }


  } catch (err) {
    mensaje.innerHTML = err;
  }

}


function calcularServicio(servicio, cantidad) {
  let precio = 0;
  let multiplicador = obtenerMultiplicador(vehiculo.value);

  switch(servicio) {
    case "aceite":
      precio = SERVICIOS[0].precio;
    break;
    case "filtros":
      precio = SERVICIOS[1].precio;
    break;
    case "frenos":
      precio = SERVICIOS[2].precio;
    break;
    case "neumaticos":
      precio = SERVICIOS[3].precio;
    break;
    case "alineado":
      precio = SERVICIOS[4].precio;
  }


  return precio * cantidad * multiplicador;
}

/**
 * Función que aplica el descuento al precio base del presupuesto
 * @param {*} base 
 * @returns 
 */
function aplicarDescuento(base) {
  let descuento = 0;

  if(base>=300)
    descuento = base * DESCUENTO10;
  else if((base>=150) && (base<=299.99))
    descuento = base * DESCUENTO5;

  return base - descuento;
}

function obtenerDescuento(base) {
  let descuento = 0;

  if(base>=300)
    descuento = DESCUENTO10*100;
  else if((base>=150) && (base<=299.99))
    descuento = DESCUENTO5*100;

  return descuento;
}

/**
 * Función que devuelve el multiplicador del vehículo
 * @param {*} vehiculo 
 * @returns 
 */
function obtenerMultiplicador(vehiculo) {
  let multiplicador = 0;

  switch(vehiculo) {
    case "moto":
      multiplicador = MULTMOTO;
    break;
    case "turismo":
      multiplicador = MULTTURISMO;
    break;
    case "suv":
      multiplicador = MULTSUV;
    break;
    case "furgoneta":
      multiplicador = MULTFURGONETA;
  }

  return multiplicador;
}

/**
 * Función que verifica la correcta entrada
 * de los datos del formulario para la generación del presupuesto
 * @returns 
 */
function verificacionDatos() {
  
  if(nombre.value == "")
    throw new Error("Nombre de cliente obligatorio");

  if(matricula.value.length<7)
    throw new Error("La matricula debe tener mínimo 7 caracteres");

  if((vehiculo.value=="")&&(pago.value==""))
    throw new Error("Se debe seleccionar vehículo y la forma de pago");

  if((aceite.value<0 || aceite.value>4) && (filtros.value<0 || filtros.value>4) && (frenos.value<0 || frenos.value>4) && (neumaticos.value<0 || neumaticos.value>4) && (alineado.value<0 || alineado.value>4))
    throw new Error("Las cantidades deben tener un valor entero entre 0 y 4");

  if((aceite.value==0) && (filtros.value==0) && (frenos.value==0) && (neumaticos.value==0) && (alineado.value==0))
    throw new Error("Se debe elegir al menos un servicio");

  if((vehiculo.value == "moto" && neumaticos.value > 2) || (vehiculo.value == "moto" && alineado.value != 0))
    throw new Error("Una moto no puede llevar más de 2 neumáticos ni hacerse un alineado de dirección");


  return true;
}