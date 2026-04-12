// --- Función principal: inicializa la página ---
async function initVerVehiculo() {
    if (typeof verificarUsuario === "function") {
        verificarUsuario();
    }

    const id = getVehiculoIdFromUrl();

    if (!id) {
        mostrarMensaje("No se seleccionó ningún vehículo.", "error", "mensaje-detalle-vehiculo");
        setTimeout(() => {
            volver();
        }, 1200);
        return;
    }

    await cargarVehiculo(id);
}

function getVehiculoIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function cargarVehiculo(id) {
    try {
        limpiarMensaje("mensaje-detalle-vehiculo");

        const query = `
            query {
                obtenerVehiculoPorId(id: "${id}") {
                    _id
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
                        _id
                        nombre
                        primerApellido
                        segundoApellido
                        correo
                        telefono
                    }
                }
            }
        `;

        const response = await fetch(`${apiBaseUrl}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

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

        const vehiculo = data.data.obtenerVehiculoPorId;

        mostrarVehiculo(vehiculo);

    } catch (error) {
        mostrarMensaje("Error al conectar con el servidor.", "error", "mensaje-detalle-vehiculo");
        setTimeout(() => {
            volver();
        }, 1200);
    }
}

function mostrarVehiculo(vehiculo) {
    const contenedor = document.getElementById('vehiculoDetalles');

    let usuarioInfo = '';

    if (vehiculo.usuario) {
        usuarioInfo += `<p><strong>Nombre:</strong> ${vehiculo.usuario.nombre || ''}</p>`;

        if (vehiculo.usuario.primerApellido) {
            usuarioInfo += `
                <p><strong>Apellidos:</strong> ${vehiculo.usuario.primerApellido || ''} ${vehiculo.usuario.segundoApellido || ''}</p>
                <p><strong>Teléfono:</strong> ${vehiculo.usuario.telefono}</p>
                <p><strong>Correo:</strong> ${vehiculo.usuario.correo}</p>
            `;
        }
    } else {
        usuarioInfo = `<p>Vendedor no disponible</p>`;
    }

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

initVerVehiculo();