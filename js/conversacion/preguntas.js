async function enviarPregunta() {

    const chatActual = conversacionSeleccionada;
    const textarea = document.getElementById("textoPregunta");
    const texto = textarea.value.trim();

    limpiarMensaje("mensaje-chat");

    if (!texto) {
        mostrarMensaje("Debes escribir una pregunta.", "error", "mensaje-chat");
        return;
    }

    if (!conversacionSeleccionada) {
        mostrarMensaje("Debes seleccionar una conversación.", "error", "mensajechat");
        return;
    }

    let vehiculoId = null;

    // Busca el vehículo asociado a la conversación seleccionada
    const conversacion = conversacionesAgrupadas[conversacionSeleccionada];

    // Si ya existe conversación, toma el ID del vehículo desde esa conversación
    if (conversacion) {
        vehiculoId = conversacion.vehiculoId;
    } else {
        vehiculoId = conversacionSeleccionada;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${vehiculoId}/pregunta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                pregunta: texto
            })
        });

        const data = await response.json();

        // Si el usuario ya cambió de chat, no mostrar nada aquí
        if (chatActual !== conversacionSeleccionada) return;

        if (!response.ok) {
            mostrarMensaje(data.mensaje || "No se pudo enviar la pregunta.", "error", "mensaje-chat");
            return;
        }

        textarea.value = "";
        limpiarMensaje("mensaje-chat");

        await cargarConversaciones();

        // Después de recargar las conversaciones, selecciona la conversación actualizada
        const nuevaConversacionId = `${vehiculoId} - ${usuarioLogueadoId}`;
        if (conversacionesAgrupadas[nuevaConversacionId]) {
            await seleccionarConversacion(nuevaConversacionId);
        }

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al enviar pregunta.", "error", "mensaje-chat");
    }
}