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
    let correo = recuperaraTexto("correo")

    let cliente = buscarCliente(cedula);

    if (cliente === null) {
        cliente = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ingresos: ingresos,
            egresos: egresos,
            correo : correo
        };

        clientes.push(cliente);
    } else {
        cliente.nombre = nombre;
        cliente.apellido = apellido;
        cliente.ingresos = ingresos;
        cliente.egresos = egresos;
        cliente.correo = correo;

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
        contenido += "<td>" + clientes[i].correo + "</td>";
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
        mostrarTextoEnCaja("correo",cliente.correo);
    }
}

// Limpia los campos del formulario
function limpiar() {
    mostrarTextoEnCaja("cedula", "");
    mostrarTextoEnCaja("nombre", "");
    mostrarTextoEnCaja("apellido", "");
    mostrarTextoEnCaja("ingresos", "");
    mostrarTextoEnCaja("egresos", "");
    mostrarTextoEnCaja("correo", "")

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
function calcularCredito() {
    let cedula = recuperaraTexto("buscarCedulaCredito");
    let cliente = buscarCliente(cedula);
    let resultado = document.getElementById("resultadoCredito");

    if (cliente === null) {
        resultado.innerHTML = "Primero debe buscar un cliente registrado.";
        resultado.className = "";
        document.getElementById("btnAsignarCredito").disabled = true;
        return;
    }

    // Guardamos el cliente seleccionado
    clienteSeleccionado = cliente;

    let monto = recuperarFloat("montoCredito");
    let plazo = recuperarFloat("plazoCredito");

    if (isNaN(monto) || monto <= 0) {
        resultado.innerHTML = "Ingrese un monto válido.";
        resultado.className = "";
        document.getElementById("btnAsignarCredito").disabled = true;
        return;
    }

    if (isNaN(plazo) || plazo <= 0) {
        resultado.innerHTML = "Ingrese un plazo válido en años.";
        resultado.className = "";
        document.getElementById("btnAsignarCredito").disabled = true;
        return;
    }

    let disponible = calcularDisponible(cliente.ingresos, cliente.egresos);
    let capacidadPago = calcularCapacidadPago(disponible);
    let interes = calcularInteresSimple(monto, tasaInteres, plazo);
    let total = calcularTotalPagar(monto, interes);
    let cuota = calcularCuotaMensual(total, plazo);

    creditoAprobado = aprobarCredito(capacidadPago, cuota);

    montoCalculado = monto;
    plazoCalculado = plazo;
    cuotaCalculada = cuota;

    resultado.innerHTML =
        "Capacidad de pago: $" + capacidadPago.toFixed(2) + "<br>" +
        "Total a pagar: $" + total.toFixed(2) + "<br>" +
        "Cuota mensual: $" + cuota.toFixed(2) + "<br>" +
        "<strong>RESULTADO: " +
        (creditoAprobado ? "Aprobado" : "Rechazado") +
        "</strong>";

    if (creditoAprobado) {
        resultado.className = "aprobado";
    } else {
        resultado.className = "rechazado";
    }

    // ===== ESTA ES LA LÍNEA CLAVE =====
    document.getElementById("btnAsignarCredito").disabled = !creditoAprobado;
}
function asignarCredito() {
    console.log("Función asignarCredito ejecutada"); // para verificar en consola

    if (!creditoAprobado) {
        alert("El crédito no está aprobado.");
        return;
    }

    if (clienteSeleccionado === null) {
        alert("No hay un cliente seleccionado. Busca el cliente primero.");
        return;
    }

    let credito = {
        cedula: clienteSeleccionado.cedula,
        nombre: clienteSeleccionado.nombre,
        apellido: clienteSeleccionado.apellido,
        monto: montoCalculado,
        tasa: tasaInteres,
        plazo: plazoCalculado,
        cuota: cuotaCalculada
    };

    creditos.push(credito);

    console.log("Crédito agregado:", credito);
    console.log("Arreglo creditos completo:", creditos);

    // Mensaje visual
    let resultado = document.getElementById("resultadoCredito");
    resultado.innerHTML += "<br><strong style='color: green;'>✓ Crédito asignado correctamente</strong>";

    // Deshabilitar el botón después de asignar
    document.getElementById("btnAsignarCredito").disabled = true;

    alert("Crédito asignado correctamente");
}