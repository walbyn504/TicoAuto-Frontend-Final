async function enviarRespuesta(preguntaId) {

    const textarea = document.getElementById("textoPregunta");
    const texto = textarea.value.trim();

    limpiarMensaje("mensaje-chat");

    if (!texto) {
        mostrarMensaje("Debes escribir una respuesta.", "error", "mensaje-chat");
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/pregunta/${preguntaId}/respuesta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                respuesta: texto
            })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.message || "No se pudo enviar la respuesta.", "error", "mensaje-chat");
            return;
        }

        textarea.value = "";
        limpiarMensaje("mensaje-chat");

        await cargarConversaciones();

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al enviar respuesta.", "error", "mensaje-chat");
    }
}