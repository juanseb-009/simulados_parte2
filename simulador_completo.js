
let clientes = [];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

// Oculta todas las secciones
function ocultarSecciones() {
  let secciones = document.getElementsByTagName("section");

  for (let i = 0; i < secciones.length; i++) {
    secciones[i].classList.remove("activa");
  }
}

// Muestra la sección indicada
function mostrarSeccion(id) {
  ocultarSecciones();

  let componente = document.getElementById(id);
  componente.classList.add("activa");
}

// Guarda y valida la tasa de interés
function guardarTasa() {
  let tasa = recuperarFloat("tasaInteres");

  if (!isNaN(tasa) && tasa >= 10 && tasa <= 20) {
    tasaInteres = tasa;
    mostrarTexto(
      "mensajeTasa",
      "Tasa configurada correctamente: " + tasaInteres + "%"
    );
  } else {
    mostrarTexto(
      "mensajeTasa",
      "La tasa debe estar entre 10% y 20%"
    );
  }
}
