function verDetalles(id) {
    // Redirige a la página de detalles del vehículo pasando el ID como parámetro en la URL
    location.href = `html/vehiculo/verInfoVehiculo.html?id=${id}`;
}

function copiarEnlace(id, boton) {
    try {
        // Construye el enlace para la página de detalles del vehículo
        const enlace = `${window.location.origin}/html/vehiculo/verInfoVehiculo.html?id=${id}`;
         // Copia el enlace al portapapeles
        navigator.clipboard.writeText(enlace);
        // Muestra un mensaje en el botón indicando que el enlace fue copiado con éxito
        mostrarMensajeEnBoton("Enlace copiado al portapapeles", "success", boton);
    } catch (error) {
        mostrarMensajeEnBoton("No se pudo copiar el enlace", "error", boton);
    }
}

function abrirPaginaPregunta(vehiculoId){
    // Redirige a la página de conversación, pasando el ID del vehículo como parámetro en la URL
    window.location.href = `/html/conversacion/conversacion.html?vehiculoId=${vehiculoId}`;
}