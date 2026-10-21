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

// Guarda un cliente nuevo o actualiza uno existente
function guardarCliente() {
    let cedula = recuperaraTexto("cedula");
    let nombre = recuperaraTexto("nombre");
    let apellido = recuperaraTexto("apellido");
    let ingresos = recuperarFloat("ingresos");
    let egresos = recuperarFloat("egresos");

    let cliente = buscarCliente(cedula);

    if (cliente === null) {
        cliente = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ingresos: ingresos,
            egresos: egresos
        };

        clientes.push(cliente);
    } else {
        cliente.nombre = nombre;
        cliente.apellido = apellido;
        cliente.ingresos = ingresos;
        cliente.egresos = egresos;
    }

    clienteSeleccionado = null;

    pintarClientes();
}

// Muestra los clientes en la tabla
function pintarClientes() {
    let contenido = "";
    let tabla = document.getElementById("tablaClientes");

    for (let i = 0; i < clientes.length; i++) {
        contenido += "<tr>";
        contenido += "<td>" + clientes[i].cedula + "</td>";
        contenido += "<td>" + clientes[i].nombre + "</td>";
        contenido += "<td>" + clientes[i].apellido + "</td>";
        contenido += "<td>" + clientes[i].ingresos + "</td>";
        contenido += "<td>" + clientes[i].egresos + "</td>";
        contenido += "<td><button onclick=\"seleccionarCliente('" + clientes[i].cedula + "')\">Actualizar</button></td>";
        contenido += "</tr>";
    }

    tabla.innerHTML = contenido;
}

// Busca un cliente por su cédula
function buscarCliente(cedula) {
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            return clientes[i];
        }
    }

    return null;
}

// Selecciona un cliente y muestra sus datos
function seleccionarCliente(cedula) {
    let cliente = buscarCliente(cedula);

    if (cliente !== null) {
        clienteSeleccionado = cliente;

        mostrarTextoEnCaja("cedula", cliente.cedula);
        mostrarTextoEnCaja("nombre", cliente.nombre);
        mostrarTextoEnCaja("apellido", cliente.apellido);
        mostrarTextoEnCaja("ingresos", cliente.ingresos);
        mostrarTextoEnCaja("egresos", cliente.egresos);
    }
}

// Limpia los campos del formulario
function limpiar() {
    mostrarTextoEnCaja("cedula", "");
    mostrarTextoEnCaja("nombre", "");
    mostrarTextoEnCaja("apellido", "");
    mostrarTextoEnCaja("ingresos", "");
    mostrarTextoEnCaja("egresos", "");

    clienteSeleccionado = null;
}

function buscarClienteCredito() {
    let cedula = recuperaraTexto("buscarCedulaCredito");
    let cliente = buscarCliente(cedula);
    let datosClienteCredito = document.getElementById("datosClienteCredito");

    if (cliente === null) {
        datosClienteCredito.innerHTML = "<p>Cliente no encontrado.</p>";
    } else {
        datosClienteCredito.innerHTML = `
            <h3>Datos del Cliente</h3>
            <p><strong>Cédula:</strong> ${cliente.cedula}</p>
            <p><strong>Nombre:</strong> ${cliente.nombre}</p>
            <p><strong>Apellido:</strong> ${cliente.apellido}</p>
            <p><strong>Ingresos:</strong> ${cliente.ingresos}</p>
            <p><strong>Egresos:</strong> ${cliente.egresos}</p>
        `;
    }
}