// Funciones para mostrar y limpiar mensajes en la interfaz de usuario
function mostrarMensaje(texto, tipo = "error", idContenedor = "mensaje-filtros") {
    const contenedor = document.getElementById(idContenedor);

    // Si el contenedor no existe, no hace nada
    if (!contenedor) return;

    contenedor.innerHTML = "";

    // Crea el elemento de mensaje
    const mensaje = document.createElement("div");
    mensaje.className = `mensaje mensaje-${tipo}`;
    mensaje.textContent = texto; // Asigna el texto del mensaje

    // Agrega el mensaje al contenedor
    contenedor.appendChild(mensaje);

    // Elimina el mensaje después de 20 segundos
    setTimeout(() => {
        if (contenedor.contains(mensaje)) {
            mensaje.remove();
        }
    }, 20000);
}

function limpiarMensaje(idContenedor = "mensaje-filtros") {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;
    contenedor.innerHTML = "";
}

// Muestra un mensaje sobre un botón específico
function mostrarMensajeEnBoton(texto, tipo = "success", boton) {
    if (!boton) return;

    const padre = boton.parentElement;
    if (!padre) return;

    padre.style.position = "relative"; // Establece la posición relativa para el contenedor

    // Elimina cualquier mensaje anterior sobre el botón
    const mensajeAnterior = padre.querySelector(".mensaje-boton");
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    // Crea un nuevo mensaje sobre el botón
    const mensaje = document.createElement("div");
    mensaje.className = `mensaje-boton mensaje-boton-${tipo}`;
    mensaje.textContent = texto; // Asigna el texto del mensaje

    padre.appendChild(mensaje); // Agrega el mensaje sobre el botón

    // Elimina el mensaje después de 4 segundos
    setTimeout(() => {
        if (padre.contains(mensaje)) {
            mensaje.remove();
        }
    }, 4000);
}