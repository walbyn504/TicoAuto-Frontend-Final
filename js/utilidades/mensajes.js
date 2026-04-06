function mostrarMensaje(texto, tipo = "error", idContenedor = "mensaje-filtros") {
    const contenedor = document.getElementById(idContenedor);

    if (!contenedor) return;

    contenedor.innerHTML = "";

    const mensaje = document.createElement("div");
    mensaje.className = `mensaje mensaje-${tipo}`;
    mensaje.textContent = texto;

    contenedor.appendChild(mensaje);

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

function mostrarMensajeEnBoton(texto, tipo = "success", boton) {
    if (!boton) return;

    const padre = boton.parentElement;
    if (!padre) return;

    padre.style.position = "relative";

    const mensajeAnterior = padre.querySelector(".mensaje-boton");
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    const mensaje = document.createElement("div");
    mensaje.className = `mensaje-boton mensaje-boton-${tipo}`;
    mensaje.textContent = texto;

    padre.appendChild(mensaje);

    setTimeout(() => {
        if (padre.contains(mensaje)) {
            mensaje.remove();
        }
    }, 4000);
}