// Genera la lista lateral de conversaciones
async function mostrarListaConversaciones() {

    const lista = document.getElementById("listaConversaciones");
    lista.innerHTML = ""; // Limpia la lista

    // Convierte el objeto de conversaciones en un arreglo
    const conversaciones = Object.values(conversacionesAgrupadas);

    let tituloRecibidasAgregado = false;
    let tituloRealizadasAgregado = false;

    // Recorre todas las conversaciones
    for (let i = 0; i < conversaciones.length; i++) {

        const c = conversaciones[i];

        // Verifica si el usuario es propietario del vehículo
        const esPropietario = String(usuarioLogueadoId) === String(c.propietarioId);

        // Agrega el título correspondiente
        if (esPropietario) {
            tituloRecibidasAgregado = agregarTituloSiCorresponde(
                lista,
                "Consultas recibidas",
                tituloRecibidasAgregado
            );
        } else {
            tituloRealizadasAgregado = agregarTituloSiCorresponde(
                lista,
                "Consultas realizadas",
                tituloRealizadasAgregado
            );
        }

        // Verifica si la conversación tiene preguntas pendientes
        const pendiente = tienePendiente(c, esPropietario);

        // Crea el elemento visual del chat
        const item = crearItemConversacion(c, esPropietario, pendiente);

        // Agrega el chat a la lista lateral
        lista.appendChild(item);
    }

    // Abre automáticamente la primera conversación
    await abrirConversacionInicial(conversaciones);
}


// Agrega un título a la lista solo si todavía no se ha agregado
function agregarTituloSiCorresponde(lista, texto, yaAgregado) {
    if (!yaAgregado) {
        const titulo = document.createElement("div");
        titulo.className = "chat-seccion-titulo";
        titulo.innerText = texto;

         // Lo agrega al contenedor de la lista de conversaciones
        lista.appendChild(titulo);
        return true;
    }
    return yaAgregado;
}

// Verifica si la conversación tiene preguntas sin responder
function tienePendiente(conversacion, esPropietario) {

    // Si no soy el propietario o no hay mensajes, no hay pendientes
    if (!esPropietario || !conversacion.mensajes || conversacion.mensajes.length === 0) {
        return false;
    }

    // Recorre los mensajes buscando preguntas sin respuesta
    for (let j = 0; j < conversacion.mensajes.length; j++) {
        if (!conversacion.mensajes[j].respuesta) {
            return true;
        }
    }

    return false;
}


// Crea la lista lateral
function crearItemConversacion(c, esPropietario, pendiente) {

    const item = document.createElement("div");
    item.className = "chat-item";

    // Si tiene mensajes pendientes se agrega estilo visual
    if (pendiente) {
        item.classList.add("chat-pendiente");
    }

    // Muestra el nombre del usuario correspondiente
    const nombreMostrar = esPropietario
        ? c.mensajes[0].pregunta.usuario.nombre
        : c.propietario;

    // Contenido del chat en la lista
    item.innerHTML = `
        <strong>${nombreMostrar}</strong>
        <small>
            ${c.marca} ${c.modelo}
            ${pendiente ? '<span class="chat-punto"></span>' : ''}
        </small>
    `;

    // Evento al hacer clic en la conversación
    item.onclick = function () {

        // Quita el estado activo de todos los chats
        document.querySelectorAll(".chat-item").forEach(chat => {
            chat.classList.remove("activo");
        });

        // Marca este chat como activo
        item.classList.add("activo");

        // Abre la conversación seleccionada
        seleccionarConversacion(c.conversacionId);
    };

    return item;
}

// Función para seleccionar una conversación específica y mostrar su contenido.
async function seleccionarConversacion(conversacionId) {
    conversacionSeleccionada = conversacionId; // Asigna el ID de la conversación seleccionada
    document.getElementById("textoPregunta").value = "";

    // Borra mensaje del chat anterior
    limpiarMensaje("mensaje-chat");

    // Elimina la clase "activo" de todas las conversaciones en la lista
    const items = document.querySelectorAll(".chat-item");
    items.forEach(item => item.classList.remove("activo"));

    // Obtiene la conversación seleccionada de las conversaciones agrupadas
    const conversacion = conversacionesAgrupadas[conversacionId];

    if (conversacion) {
        // Si se encuentra la conversación, busca su índice en la lista de conversaciones agrupadas
        const conversaciones = Object.values(conversacionesAgrupadas);
        const index = conversaciones.findIndex(c => c.conversacionId === conversacionId);

        // Si se encuentra la conversación en la lista, marca el item correspondiente como activo
        if (index !== -1 && items[index]) {
            items[index].classList.add("activo");
        }

        // Muestra el contenido de la conversación existente
        mostrarConversacionExistente(conversacion);
        return;
    }

    // Si la conversación no existe, muestra un mensaje indicando que no hay conversación para el vehículo
    await mostrarVehiculoSinConversacion(conversacionId);
}

function mostrarConversacionExistente(conversacion) {

    // Encabezado del chat
    document.getElementById("encabezadoChat").textContent =
        `Propietario: ${conversacion.propietario} | Datos vehículo: ${conversacion.marca} ${conversacion.modelo}`;

    // Mostrar mensajes
    mostrarMensajes(conversacion.mensajes);

    // ¿Es el dueño?
    const esPropietario = String(usuarioLogueadoId) === String(conversacion.propietarioId);

    // Reset estado
    modoEnvio = null;
    preguntaPendienteId = null;

    if (esPropietario) {

        // Dueño siempre responde
        modoEnvio = "respuesta";

        let preguntaObjetivo = null;

        // Buscar pendiente
        for (let i = 0; i < conversacion.mensajes.length; i++) {
            if (!conversacion.mensajes[i].respuesta) {
                preguntaObjetivo = conversacion.mensajes[i];
                break;
            }
        }

        // Si no hay pendiente → usar última
        // (para que backend diga "ya fue respondida")
        if (!preguntaObjetivo && conversacion.mensajes.length > 0) {
            preguntaObjetivo = conversacion.mensajes[conversacion.mensajes.length - 1];
        }

        // ID que se enviará al backend
        if (preguntaObjetivo) {
            preguntaPendienteId = preguntaObjetivo.pregunta.id;
        }

    } else {

        // Usuario hace preguntas
        modoEnvio = "pregunta";
        preguntaPendienteId = null;
    }
}

// Muestra los detalles del vehículo y permite al usuario enviar una pregunta si es el caso.
async function mostrarVehiculoSinConversacion(vehiculoId) {

    // Obtiene la información del vehículo utilizando su ID
    const vehiculo = await obtenerVehiculo(vehiculoId);

    // Si no se encuentra el vehículo, muestra un mensaje de error
    if (!vehiculo) {
        document.getElementById("encabezadoChat").textContent = "Vehículo no encontrado";
        document.getElementById("mensajesChat").innerHTML = "";
        return;
    }

    // Si el vehículo se encuentra, muestra los detalles en el encabezado del chat
    document.getElementById("encabezadoChat").textContent =
    `Propietario: ${vehiculo.usuario.nombre} | Datos vehículo: ${vehiculo.marca} ${vehiculo.modelo}`;

     
    // Muestra un mensaje indicando que no hay conversaciones disponibles
    document.getElementById("mensajesChat").innerHTML = `
    <div class="chat-vacio">
        <div>
            <i class="bi bi-chat-dots fs-1 d-block mb-2"></i>
            Aún no tienes conversaciones disponibles.
        </div>
    </div>
    `;

    // Si el usuario logueado no es el propietario del vehículo, entonces puede hacer una pregunta
    if (usuarioLogueadoId !== vehiculo.usuario.id) {
        modoEnvio = "pregunta";
    }

    // Limpia cualquier pregunta pendiente
    preguntaPendienteId = null;
}

function convertirFechaAOrdenable(fecha) {
    if (!fecha) return 0;

    // Timestamp numérico o string numérico
    if (!isNaN(fecha)) {
        return Number(fecha);
    }
}


// Muestra en pantalla todos los mensajes de la conversación
function mostrarMensajes(mensajes) {
    // Obtiene el contenedor donde se mostrarán los mensajes
    const contenedor = document.getElementById("mensajesChat");
    contenedor.innerHTML = "";

    const mensajesPlano = []; // Arreglo que almacenará los mensajes de forma plana

    // Recorre los mensajes y los organiza en formato plano (pregunta o respuesta)
    for (let i = 0; i < mensajes.length; i++) {
        const item = mensajes[i];

        // Si el mensaje es una pregunta, lo agrega al arreglo de mensajesPlano
        if (item.pregunta) {
            mensajesPlano.push({
                tipo: "pregunta",
                texto: item.pregunta.pregunta,
                fecha: item.pregunta.fechaPregunta,
                nombre: item.pregunta.usuario.nombre
            });
        }

        // Si el mensaje es una respuesta, lo agrega al arreglo de mensajesPlano
        if (item.respuesta) {
            mensajesPlano.push({
                tipo: "respuesta",
                texto: item.respuesta.respuesta,
                fecha: item.respuesta.fechaRespuesta,
                nombre: conversacionesAgrupadas[conversacionSeleccionada].propietario
            });
        }
    }

    // Ordena los mensajes por fecha (de más antiguo a más reciente)
    mensajesPlano.sort((a, b) => {
        return convertirFechaAOrdenable(a.fecha) - convertirFechaAOrdenable(b.fecha);
    });

    // Variable para verificar el último usuario que envió un mensaje
    let ultimoUsuario = null;

    // Recorre los mensajes ordenados y los muestra en la interfaz
    for (let i = 0; i < mensajesPlano.length; i++) {
        const mensaje = mensajesPlano[i];
        const fechaFormateada = formatearFecha(mensaje.fecha); // Formatea la fecha del mensaje


        // Si el nombre del usuario ha cambiado, muestra el nombre del usuario
        let nombreHTML = "";
        if (ultimoUsuario !== mensaje.nombre) {
            nombreHTML = `<div class="nombre">${mensaje.nombre}</div>`;
            ultimoUsuario = mensaje.nombre; // Actualiza el último usuario
        }

        // Si el mensaje es una pregunta, se agrega con la clase "usuario"
        if (mensaje.tipo === "pregunta") {
            contenedor.innerHTML += `
                <div class="mensaje-usuario mb-2">
                    ${nombreHTML}
                    <div class="burbuja usuario">${mensaje.texto}</div>
                    <div class="fecha">${fechaFormateada}</div>
                </div>
            `;
        } else {
             // Si el mensaje es una respuesta, se agrega con la clase "propietario"
            contenedor.innerHTML += `
                <div class="mensaje-propietario mb-2">
                    ${nombreHTML}
                    <div class="burbuja propietario">${mensaje.texto}</div>
                    <div class="fecha">${fechaFormateada}</div>
                </div>
            `;
        }
    }
}