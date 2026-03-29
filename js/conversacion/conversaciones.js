async function cargarConversaciones() {
    try {
        limpiarMensaje("mensaje-chat");

        const [responseMisPreguntas, responsePreguntasDeMisVehiculos] = await Promise.all([
            fetch(`${apiBaseUrl}/api/preguntas/enviadas`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }),
            fetch(`${apiBaseUrl}/api/preguntas/recibidas`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        ]);

        const misPreguntas = await responseMisPreguntas.json();
        const preguntasDeMisVehiculos = await responsePreguntasDeMisVehiculos.json();

        if (!responseMisPreguntas.ok) {
            mostrarMensaje(misPreguntas.mensaje || "No se pudieron cargar tus preguntas", "error", "mensaje-chat");
            return;
        }

        if (!responsePreguntasDeMisVehiculos.ok) {
            mostrarMensaje(preguntasDeMisVehiculos.mensaje || "No se pudieron cargar las preguntas recibidas", "error", "mensaje-chat");
            return;
        }

        const todasLasPreguntas = [
            ...misPreguntas,
            ...preguntasDeMisVehiculos
        ];

        conversacionesAgrupadas = {};

        agruparConversacionesPorVehiculo(todasLasPreguntas);
        await mostrarListaConversaciones();

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al cargar conversaciones.", "error", "mensaje-chat");
    }
}

//Ordena las preguntas que se recibieron
function agruparConversacionesPorVehiculo(preguntasRecibidas) {

    // Recorre todas las preguntas recibidas del backend
    for (let i = 0; i < preguntasRecibidas.length; i++) {
        const item = preguntasRecibidas[i];

        // Valida que exista la pregunta y el vehículo
        if (!item.pregunta || !item.pregunta.vehiculo) {
            continue;
        }

        // Obtiene el vehículo asociado a la pregunta
        const vehiculo = item.pregunta.vehiculo;
        const vehiculoId = vehiculo._id;
        const interesadoId = item.pregunta.usuario._id;

        const conversacionId = `${vehiculoId} - ${interesadoId}`;

        // Si aún no existe una conversación para ese vehículo, la crea
        if (!conversacionesAgrupadas[conversacionId]) {
            conversacionesAgrupadas[conversacionId] = {
                conversacionId: conversacionId,
                vehiculoId: vehiculo._id,
                propietarioId: vehiculo.usuario._id,
                propietario: vehiculo.usuario.nombre,
                interesadoId: interesadoId,
                marca: vehiculo.marca,
                modelo: vehiculo.modelo,
                mensajes: [] // Lista de mensajes del chat
            };
        }

        // Verifica si esa pregunta ya existe dentro de la conversación
        const yaExiste = conversacionesAgrupadas[conversacionId].mensajes.find(
            mensaje => mensaje.pregunta._id === item.pregunta._id
        );

        // Agrega la pregunta y respuesta solo si no existe
        if (!yaExiste) {
            conversacionesAgrupadas[conversacionId].mensajes.push({
                pregunta: item.pregunta,
                respuesta: item.respuesta
            });
        }
    }
}

//Decide que chat abrir cuando carga la pagina
async function abrirConversacionInicial(conversaciones) {

    if (conversacionSeleccionada) {
        await seleccionarConversacion(conversacionSeleccionada);
        return;
    }

    if (vehiculoIdUrl) {
        for (let i = 0; i < conversaciones.length; i++) {
            if (conversaciones[i].vehiculoId === vehiculoIdUrl) {
                await seleccionarConversacion(conversaciones[i].conversacionId);
                return;
            }
        }

        await seleccionarConversacion(vehiculoIdUrl);
        return;
    }

    if (conversaciones.length > 0) {
        await seleccionarConversacion(conversaciones[0].conversacionId);
        return;
    }

    document.getElementById("mensajesChat").innerHTML = `
        <div class="text-center text-muted mt-5">
            <h5>No tienes conversaciones todavía</h5>
            <p>Cuando envíes o recibas mensajes, aparecerán aquí.</p>
        </div>
    `;

    document.getElementById("textoPregunta").value = "";
}