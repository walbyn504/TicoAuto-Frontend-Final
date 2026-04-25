// Funcion para cargar las conversaciones del usuario
async function cargarConversaciones() {
    try {
        limpiarMensaje("mensaje-chat"); // Limpia cualquier mensaje anterior en la interfaz

        // Define la consulta GraphQL para obtener las conversaciones del usuario
        const query = `
            query {
                obtenerMisConversaciones {
                    pregunta {
                        id
                        pregunta
                        fechaPregunta
                        usuario { id nombre }
                        vehiculo { id marca modelo usuario { id nombre } }
                    }
                    respuesta { id respuesta fechaRespuesta usuarioRespuesta pregunta }
                }
                obtenerConversacionesDeMisVehiculos {
                    pregunta {
                        id
                        pregunta
                        fechaPregunta
                        usuario { id nombre }
                        vehiculo { id marca modelo usuario { id nombre } }
                    }
                    respuesta { id respuesta fechaRespuesta usuarioRespuesta pregunta }
                }
            }
        `;

        // Realiza la solicitud a la API GraphQL
        const response = await fetch(`${apiBaseUrl}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ query }) // Envia la consulta GraphQL en el cuerpo de la solicitud
        });

        // Convierte la respuesta en formato JSON
        const resultado = await response.json();

        // Si hay errores en la respuesta, muestra un mensaje de error
        if (resultado.errors) {
            mostrarMensaje(resultado.errors[0].message || "Error al cargar conversaciones", "error", "mensaje-chat");
            return;
        }

         // Extrae las preguntas de las conversaciones obtenidas
        const misPreguntas = resultado.data.obtenerMisConversaciones;
        const preguntasDeMisVehiculos = resultado.data.obtenerConversacionesDeMisVehiculos;

        // Combina las preguntas en una sola lista
        const todasLasPreguntas = [
            ...misPreguntas,
            ...preguntasDeMisVehiculos
        ];

        // Agrupa las conversaciones por vehiculo e interasado
        conversacionesAgrupadas = {};

        agruparConversacionesPorVehiculo(todasLasPreguntas);
        await mostrarListaConversaciones(); // Muestra las conversaciones agrupadas

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
        const vehiculoId = vehiculo.id; 
        const interesadoId = item.pregunta.usuario.id;

        const conversacionId = `${vehiculoId} - ${interesadoId}`;

        // Si aún no existe una conversación para ese vehículo, la crea
        if (!conversacionesAgrupadas[conversacionId]) {
            conversacionesAgrupadas[conversacionId] = {
                conversacionId: conversacionId,
                vehiculoId: vehiculo.id,
                propietarioId: vehiculo.usuario.id,
                propietario: vehiculo.usuario.nombre,
                interesadoId: interesadoId,
                marca: vehiculo.marca,
                modelo: vehiculo.modelo,
                mensajes: [] // Lista de mensajes del chat
            };
        }

        // Verifica si esa pregunta ya existe dentro de la conversación
        const yaExiste = conversacionesAgrupadas[conversacionId].mensajes.find(
            mensaje => mensaje.pregunta.id === item.pregunta.id
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

    // Si hay un ID de vehículo en la URL, busca la conversación relacionada con ese vehículo
    if (vehiculoIdUrl) {
        for (let i = 0; i < conversaciones.length; i++) {
            // Si la conversación pertenece al vehículo con el ID en la URL, la selecciona
            if (conversaciones[i].vehiculoId === vehiculoIdUrl) {
                await seleccionarConversacion(conversaciones[i].conversacionId);
                return;
            }
        }

        // Si no se encuentra una conversación para ese vehículo, muestra el chat vacío para ese vehículo
        await seleccionarConversacion(vehiculoIdUrl);
        return;
    }

    // Si no hay conversaciones, muestra un mensaje indicando que no hay conversaciones disponibles
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