function verDetalles(id) {
    location.href = `html/vehiculo/verInfoVehiculo.html?id=${id}`;
}

function copiarEnlace(id, boton) {
    try {
        const enlace = `${window.location.origin}/html/vehiculo/verInfoVehiculo.html?id=${id}`;
        navigator.clipboard.writeText(enlace);
        mostrarMensajeEnBoton("Enlace copiado al portapapeles", "success", boton);
    } catch (error) {
        mostrarMensajeEnBoton("No se pudo copiar el enlace", "error", boton);
    }
}

function abrirPaginaPregunta(vehiculoId){
    window.location.href = `/html/conversacion/conversacion.html?vehiculoId=${vehiculoId}`;
}