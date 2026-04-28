// Maneja el envío de mensajes en la conevrsación, tanto preguntas como respuestas
const apiBaseUrl = "http://localhost:3001";
const graphqlBaseUrl = "http://localhost:4000";
const token = sessionStorage.getItem("token");

const params = new URLSearchParams(window.location.search); // Obtiene el parámetro "vehiculoId" de la URL
const vehiculoIdUrl = params.get("vehiculoId");

// Variables globales
let conversacionesAgrupadas = {};
let conversacionSeleccionada = null;
let modoEnvio = "pregunta";
let preguntaPendienteId = null;
let preguntaSinRespuesta = null;

// Obtener datos del usuario desde el token
let usuarioPayload = null;

// Decodifica el token para obtener la información del usuario
if (token) {
    try {
        usuarioPayload = JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        usuarioPayload = null;
    }
}

const usuarioLogueadoId = usuarioPayload ? usuarioPayload.id : null; // ID del usuario Logueado
const nombre = usuarioPayload ? usuarioPayload.nombre : null; // Nombre del usuario Logueado

// Función para enviar el mensaje dependiendo del modo (pregunta o respuesta)
async function enviarMensaje() {
    limpiarMensaje("mensaje-chat");

        // Si el modo de envío es "pregunta", llama a la función para enviar una pregunta
    if (modoEnvio === "pregunta") {
        await enviarPregunta();
        return;
    }

    // Si el modo de envío es "respuesta", valida que haya una pregunta pendiente para responder
    if (modoEnvio === "respuesta") {
        if (!preguntaPendienteId) {
            mostrarMensaje("No hay preguntas pendientes por responder.", "error", "mensaje-chat");
            return;
        }

        // Envía la respuesta a la pregunta pendiente
        await enviarRespuesta(preguntaPendienteId);
        return;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // Si no hay token o el usuario no está autenticado, redirige al inicio de sesión
    if (!token || !usuarioLogueadoId) {
        window.location.href = "../../html/usuario/inicioSesion.html";
        return;
    }

    await cargarConversaciones();
    mostrarUsuarioConectado();
});