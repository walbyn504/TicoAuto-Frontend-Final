// Funciones para manejar la visualización de usuario conectado, formato de fecha.
function mostrarUsuarioConectado() {
    // Obtiene el elemento donde se mostrará el nombre del usuario
    const elementoNombre = document.getElementById("nombreUsuarioConectado");

    // Si el elemento existe, muestra el nombre del usuario
    if (elementoNombre) {
        elementoNombre.textContent = nombre || "Usuario conectado";
    }
}

// Función para formatear una fecha en el formato "dd/mm/yyyy, hh:mm"
function formatearFecha(fecha) {
    // Si no hay fecha, retorna un mensaje de "Fecha no disponible"
    if (!fecha) return "Fecha no disponible";

    let formato;

    // Si la fecha es un número o un string numérico (timestamp)
    if (!isNaN(fecha)) {
        formato = new Date(Number(fecha));
    } else {
        // Si es un string en formato ISO u otro formato
        formato = new Date(fecha);
    }

    // Si la fecha es inválida, retorna "Fecha inválida"
    if (isNaN(formato.getTime())) return "Fecha inválida";

    // Retorna la fecha en formato local de Costa Rica
    return formato.toLocaleString("es-CR", {
        timeZone: "America/Costa_Rica",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Función para obtener la información del vehículo por su ID
async function obtenerVehiculo(vehiculoId) {
    try {
         // Consulta GraphQL para obtener los detalles del vehículo por su ID
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

        // Si la respuesta no es exitosa, retorna null
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

        return data.data.obtenerVehiculoPorId; // Retorna la información del vehículo obtenida

    } catch (error) {
        mostrarMensaje("Error al obtener el vehículo.", "error", "mensaje-chat");
        return null;
    }
}

function volverPagina() {
    window.location.href = "../../index.html";
}