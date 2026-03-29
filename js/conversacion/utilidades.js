function mostrarUsuarioConectado() {
    const elementoNombre = document.getElementById("nombreUsuarioConectado");

    if (elementoNombre) {
        elementoNombre.textContent = nombre || "Usuario conectado";
    }
}

function formatearFecha(fecha) {
    const f = new Date(fecha);

    return f.toLocaleString("es-CR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

async function obtenerVehiculo(vehiculoId) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${vehiculoId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const vehiculo = await response.json();

        if (!response.ok) {
            return null;
        }

        return vehiculo;

    } catch (error) {
        mostrarMensaje("Error al obtener el vehículo.", "error", "mensaje-chat");
        return null;
    }
}

function volverPagina() {
    window.location.href = "../../index.html";
}