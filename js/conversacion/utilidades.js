function mostrarUsuarioConectado() {
    const elementoNombre = document.getElementById("nombreUsuarioConectado");

    if (elementoNombre) {
        elementoNombre.textContent = nombre || "Usuario conectado";
    }
}

function formatearFecha(fecha) {
    if (!fecha) return "Fecha no disponible";

    let formato;

    // Si es número o string numérico (timestamp)
    if (!isNaN(fecha)) {
        formato = new Date(Number(fecha));
    } else {
        //Si es ISO string u otro formato
        formato = new Date(fecha);
    }

    if (isNaN(formato.getTime())) return "Fecha inválida";

    return formato.toLocaleString("es-CR", {
        timeZone: "America/Costa_Rica",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

async function obtenerVehiculo(vehiculoId) {
    try {
        const query = `
            query {
                obtenerVehiculoPorId(id: "${vehiculoId}") {
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
            return null;
        }

        return data.data.obtenerVehiculoPorId;

    } catch (error) {
        mostrarMensaje("Error al obtener el vehículo.", "error", "mensaje-chat");
        return null;
    }
}

function volverPagina() {
    window.location.href = "../../index.html";
}