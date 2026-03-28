function mostrarMensaje(texto, tipo = "info") {
    const contenedor = document.getElementById("contenedor-mensajes");

    if (!contenedor) return;

    // 🔥 limpiar mensajes anteriores
    contenedor.innerHTML = "";

    const mensaje = document.createElement("div");
    mensaje.classList.add("mensaje", tipo);

    mensaje.textContent = texto;

    contenedor.appendChild(mensaje);

    setTimeout(() => {
        mensaje.remove();
    }, 3000);
}