/// Función para inicializar la página de detalles de vehículo.
// Verifica si el usuario está logueado y carga la información del vehículo seleccionado.

async function initVerVehiculo() {
    if (typeof verificarUsuario === "function") {
        verificarUsuario(); // Verifica si el usuario está logueado
    }

    // Obtiene el ID del vehículo desde la URL
    const id = getVehiculoIdFromUrl();

    // Si no se seleccionó un vehículo, muestra un mensaje de error y vuelve
    if (!id) {
        mostrarMensaje("No se seleccionó ningún vehículo.", "error", "mensaje-detalle-vehiculo");
        setTimeout(() => {
            volver();
        }, 1200);
        return;
    }


    // Si hay un ID de vehículo, carga la información del vehículo
    await cargarVehiculo(id);
}

// Función para obtener el ID del vehículo desde los parámetros de la URL
function getVehiculoIdFromUrl() {
    const params = new URLSearchParams(window.location.search); // Obtiene los parámetros de la URL
    return params.get('id');
}

// Función para cargar la información del vehículo desde la API
async function cargarVehiculo(id) {
    try {
        limpiarMensaje("mensaje-detalle-vehiculo");

        // Define la consulta GraphQL para obtener los detalles del vehículo
        const query = `
            query {
                obtenerVehiculoPorId(id: "${id}") {
                    id
                    marca
                    modelo
                    anno
                    precio
                    estado
                    imagen
                    combustible
                    color
                    transmision
                    condicion
                    usuario {
                        id
                        nombre
                        primerApellido
                        segundoApellido
                        correo
                        telefono
                    }
                }
            }
        `;

        const response = await fetch(`${graphqlBaseUrl}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        // Si la respuesta no es exitosa o contiene errores, muestra un mensaje y vuelve
        if (!response.ok || data.errors) {
            mostrarMensaje(
                data?.errors?.[0]?.message || "No se pudo cargar el vehículo.",
                "error",
                "mensaje-detalle-vehiculo"
            );
            setTimeout(() => {
                volver();
            }, 1200);
            return;
        }

        const vehiculo = data.data.obtenerVehiculoPorId; // Obtiene los datos del vehículo

        mostrarVehiculo(vehiculo); // Muestra la información del vehículo en la interfaz

    } catch (error) {
        mostrarMensaje("Error al conectar con el servidor.", "error", "mensaje-detalle-vehiculo");
        setTimeout(() => {
            volver();
        }, 1200);
    }
}

// Función para mostrar los detalles del vehículo en la interfaz
function mostrarVehiculo(vehiculo) {
    // Obtiene el contenedor donde se mostrará el vehículo

    const contenedor = document.getElementById('vehiculoDetalles');

    // Variable para almacenar la información del vendedor
    let usuarioInfo = '';

    // Si el vehículo tiene información del vendedor, la agrega al contenido
    if (vehiculo.usuario) {
        usuarioInfo += `<p><strong>Nombre:</strong> ${vehiculo.usuario.nombre || ''}</p>`;

        // Si hay apellidos y otros datos del vendedor, los agrega
        if (vehiculo.usuario.primerApellido) {
            usuarioInfo += `
                <p><strong>Apellidos:</strong> ${vehiculo.usuario.primerApellido || ''} ${vehiculo.usuario.segundoApellido || ''}</p>
                <p><strong>Teléfono:</strong> ${vehiculo.usuario.telefono}</p>
                <p><strong>Correo:</strong> ${vehiculo.usuario.correo}</p>
            `;
        }
    } else {
        usuarioInfo = `<p>Vendedor no disponible</p>`;  // Si no hay vendedor, muestra un mensaje
    }

    // Muestra los detalles del vehículo en el contenedor
    contenedor.innerHTML = `
        <div class="detalle-vehiculo">
            <div class="detalle-header">
                <h1 class="titulo-card">${vehiculo.marca} ${vehiculo.modelo}</h1>
                <div class="detalle-precio">Precio: $${vehiculo.precio}</div>
            </div>

            <div class="detalle-imagen-contenedor">
                <img 
                    src="${apiBaseUrl}/imagenes/${vehiculo.imagen}" 
                    class="detalle-imagen" 
                    alt="${vehiculo.marca} ${vehiculo.modelo}">
            </div>

            <div class="detalle-grid">
                <div class="detalle-seccion">
                    <h4 class="detalle-subtitulo">Información del vehículo</h4>
                    <p><strong>Año:</strong> ${vehiculo.anno}</p>
                    <p><strong>Estado:</strong> ${vehiculo.estado || "Disponible"}</p>
                    <p><strong>Combustible:</strong> ${vehiculo.combustible || "No especificado"}</p>
                    <p><strong>Color:</strong> ${vehiculo.color || "No especificado"}</p>
                    <p><strong>Transmisión:</strong> ${vehiculo.transmision || "No especificada"}</p>
                    <p><strong>Condición:</strong> ${vehiculo.condicion || "No especificada"}</p>
                </div>

                <div class="detalle-seccion">
                    <h4 class="detalle-subtitulo">Información del vendedor</h4>
                    ${usuarioInfo}
                </div>
            </div>
        </div>
    `;
}

function volver() {
    window.history.back();
}


// Llama a la función principal para inicializar la página
initVerVehiculo();