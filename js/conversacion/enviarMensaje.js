const apiBaseUrl = "http://localhost:3001";
const token = sessionStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const vehiculoIdUrl = params.get("vehiculoId");

// Variables globales
let conversacionesAgrupadas = {};
let conversacionSeleccionada = null;
let modoEnvio = "pregunta";
let preguntaPendienteId = null;
let preguntaSinRespuesta = null;

// Obtener datos del usuario desde el token
let usuarioPayload = null;

if (token) {
    try {
        usuarioPayload = JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        usuarioPayload = null;
    }
}

const usuarioLogueadoId = usuarioPayload ? usuarioPayload.id : null;
const nombre = usuarioPayload ? usuarioPayload.nombre : null;

async function enviarMensaje() {
    limpiarMensaje("mensaje-chat");

    if (modoEnvio === "pregunta") {
        await enviarPregunta();
        return;
    }

    if (modoEnvio === "respuesta") {
        if (!preguntaPendienteId) {
            mostrarMensaje("No hay preguntas pendientes por responder.", "error", "mensaje-chat");
            return;
        }

        await enviarRespuesta(preguntaPendienteId);
        return;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    if (!token || !usuarioLogueadoId) {
        window.location.href = "../../html/usuario/inicioSesion.html";
        return;
    }

    await cargarConversaciones();
    mostrarUsuarioConectado();
});