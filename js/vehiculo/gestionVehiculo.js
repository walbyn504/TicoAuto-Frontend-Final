window.onload = function () {
    verificarUsuario();
    obtenerVehiculos();

    const mensaje = sessionStorage.getItem('mensajeGlobal');
    const tipo = sessionStorage.getItem('tipoMensaje');

    if (mensaje) {
        mostrarMensaje(mensaje, tipo, 'mensaje-gestion-vehiculo');

        sessionStorage.removeItem('mensajeGlobal');
        sessionStorage.removeItem('tipoMensaje');
    }
};


async function obtenerVehiculos() {

    limpiarMensaje("mensaje-gestion-vehiculo");

    if (!token) {
        mostrarMensaje("Debe iniciar sesión.", "error", "mensaje-gestion-vehiculo");
        setTimeout(() => {
            location.href = "/html/usuario/inicioSesion.html";
        }, 2000);
        return;
    }

    try {
        const query = `
            query {
                obtenerMisVehiculos {
                    _id
                    marca
                    modelo
                    anno
                    precio
                    imagen
                    estado
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
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        if (!response.ok || data.errors) {
            const mensaje = data?.errors?.[0]?.message || "Error al cargar vehículos.";

            if (mensaje === "Usuario no autenticado") {
                mostrarMensaje("Sesión expirada.", "error", "mensaje-gestion-vehiculo");
                sessionStorage.removeItem("token");

                setTimeout(() => {
                    location.href = "/html/usuario/inicioSesion.html";
                }, 2500);
                return;
            }

            mostrarMensaje(mensaje, "error", "mensaje-gestion-vehiculo");
            return;
        }

        mostrarVehiculos(data.data.obtenerMisVehiculos);

    } catch (error) {
        mostrarMensaje("No se pudo conectar al servidor.", "error", "mensaje-gestion-vehiculo");
    }
}

function mostrarVehiculos(vehiculos) {
    const container = document.getElementById("vehiculosContainer");
    container.innerHTML = "";

    if (!vehiculos || vehiculos.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-white mt-4">
                <h4>No tienes vehículos registrados</h4>
                <p>Puedes crear uno desde el botón “Crear Vehículo”.</p>
            </div>
        `;
        return;
    }

    vehiculos.forEach(v => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
            <div class="card h-100">
                <img src="${apiBaseUrl}/imagenes/${v.imagen}" 
                     class="card-img-top" 
                     alt="${v.marca} ${v.modelo}">
                <div class="card-body">
                    <h5 class="card-title">${v.marca} ${v.modelo}</h5>
                    <p class="card-text">
                        <strong>Año:</strong> ${v.anno} <br>
                        <strong>Precio:</strong> $${v.precio} <br>
                        <strong>Estado:</strong> ${v.estado} <br>
                        <strong>Color:</strong> ${v.color} <br>
                        <strong>Condición:</strong> ${v.condicion} <br>
                        <strong>Combustible:</strong> ${v.combustible} <br>
                        <strong>Transmisión:</strong> ${v.transmision} <br> 
                    </p>
                    <div class="d-flex gap-2 mt-2">
                        <button class="btn btn-primary btn-sm flex-fill" onclick="editarVehiculo('${v._id}')">
                            Editar
                        </button>

                        <button class="btn btn-danger btn-sm flex-fill" onclick="eliminarVehiculo('${v._id}')">
                            Eliminar
                        </button>

                        <button class="btn btn-success btn-sm flex-fill" onclick="marcarVendido('${v._id}')">
                            Vendido
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function editarVehiculo(id) {
    location.href = `/html/vehiculo/formularioVehiculo.html?id=${id}`;
}

async function eliminarVehiculo(id) {
    if (!confirmarEliminacion()) return;

    const token = sessionStorage.getItem('token');
    if (!token) {
        mostrarMensaje("Debe iniciar sesión.", "error", "mensaje-gestion-vehiculo");
        return;
    }

    limpiarMensaje("mensaje-gestion-vehiculo");

    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.message || "Error al eliminar el vehículo.", "error", "mensaje-gestion-vehiculo");
            return;
        }

        await obtenerVehiculos();
        mostrarMensaje(data.message || "Vehículo eliminado", "success", "mensaje-gestion-vehiculo");

    } catch (error) {
        mostrarMensaje("No se pudo conectar al servidor.", "error", "mensaje-gestion-vehiculo");
    }
}

function confirmarEliminacion() {
    return confirm("¿Seguro que desea eliminar este vehículo?");
}

function confirmarVendido() {
    return confirm("¿Seguro que desea marcar como vendido este vehículo?");
}

async function marcarVendido(id) {
    if (!confirmarVendido()) return;

    const token = sessionStorage.getItem('token');
    if (!token) {
        mostrarMensaje("Debe iniciar sesión.", "error", "mensaje-gestion-vehiculo");
        return;
    }

    limpiarMensaje("mensaje-gestion-vehiculo");

    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/vendido/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                mostrarMensaje(data.message || "Sesión expirada.", "error", "mensaje-gestion-vehiculo");
                sessionStorage.removeItem("token");

                setTimeout(() => {
                    location.href = "/html/usuario/inicioSesion.html";
                }, 1200);
                return;
            }

            mostrarMensaje(data.message || "Error al marcar el vehículo como vendido.", "error", "mensaje-gestion-vehiculo");
            return;
        }

        await obtenerVehiculos();
        mostrarMensaje(data.message || "Vehículo marcado como vendido.", "success", "mensaje-gestion-vehiculo");

    } catch (error) {
        mostrarMensaje("No se pudo conectar al servidor.", "error", "mensaje-gestion-vehiculo");
    }
}