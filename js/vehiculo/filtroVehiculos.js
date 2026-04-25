// Lógica para manejar la búsqueda de vehículos con filtros y paginación usando GraphQL.
// Incluye la validación de filtros, la obtención de datos desde la API, la visualización de resultados

let paginaActual = 1;
let totalPaginas = 1;

// --- Función principal: inicializa la página ---
async function initFiltroVehiculos() {
    verificarUsuario(); // Verifica si el usuario está autenticado
    await ejecutarBusqueda(1); // Ejecuta la búsqueda de vehículos en la página 1
}

// Ejecuta la búsqueda de vehículos con filtros y paginación usando GraphQL
async function ejecutarBusqueda(page = paginaActual) {
    try {
        paginaActual = page;

        limpiarMensaje("mensaje-filtros");

        const filtros = obtenerFiltrosBusqueda(); // Obtiene los filtros aplicados

        // Si los filtros no son válidos, detiene la ejecución
        if (!validarFiltros(filtros)) {
            return;
        }

        const limit = 3;  // Define el límite de resultados por página

        // Mantener la URL bonita para paginación/filtros
        const params = new URLSearchParams();

        // Añade los filtros a la URL
        if (filtros.marca) params.append('marca', filtros.marca);
        if (filtros.modelo) params.append('modelo', filtros.modelo);
        if (filtros.anno_min) params.append('anno_min', filtros.anno_min);
        if (filtros.anno_max) params.append('anno_max', filtros.anno_max);
        if (filtros.precio_min) params.append('precio_min', filtros.precio_min);
        if (filtros.precio_max) params.append('precio_max', filtros.precio_max);
        if (filtros.estado) params.append('estado', filtros.estado);

        params.append('page', paginaActual);
        params.append('limit', limit);

        // Actualiza la URL del navegador sin recargar la página
        history.replaceState(null, "", "?" + params.toString());

        // Construcción dinámica de argumentos GraphQL
        const argumentos = [];

        // Añade los filtros a los argumentos de la consulta
        if (filtros.marca) argumentos.push(`marca: ${JSON.stringify(filtros.marca)}`);
        if (filtros.modelo) argumentos.push(`modelo: ${JSON.stringify(filtros.modelo)}`);
        if (filtros.anno_min) argumentos.push(`anno_min: ${parseInt(filtros.anno_min)}`);
        if (filtros.anno_max) argumentos.push(`anno_max: ${parseInt(filtros.anno_max)}`);
        if (filtros.precio_min) argumentos.push(`precio_min: ${parseInt(filtros.precio_min)}`);
        if (filtros.precio_max) argumentos.push(`precio_max: ${parseInt(filtros.precio_max)}`);
        if (filtros.estado) argumentos.push(`estado: ${JSON.stringify(filtros.estado)}`);


        // Añade los parámetros de paginación a los argumentos
        argumentos.push(`page: ${paginaActual}`);
        argumentos.push(`limit: ${limit}`);

        // Construcción de la consulta GraphQL
        const query = `
            query {
                filtroVehiculos(${argumentos.join(", ")}) {
                    paginaActual
                    totalPaginas
                    vehiculos {
                        id
                        marca
                        modelo
                        anno
                        precio
                        estado
                        imagen
                        usuario {
                            id
                        }
                    }
                }
            }
        `;

        const response = await fetch(`${apiBaseUrl}/graphql`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }) // Envia la consulta GraphQL en el cuerpo de la solicitud
        });

        const resultado = await response.json(); // Obtiene la respuesta de la API

        // Si la respuesta contiene errores o no es exitosa, muestra un mensaje de error
        if (!response.ok || resultado.errors) {
            const mensaje =
                resultado?.errors?.[0]?.message ||
                resultado?.message ||
                "No se pudo realizar la búsqueda";

            mostrarMensaje(mensaje, "error", "mensaje-filtros");
            document.getElementById('vehiculosContainer').innerHTML = '';
            return;
        }

        const data = resultado.data.filtroVehiculos;

        // Si no hay vehículos encontrados, muestra un mensaje
        if (!data.vehiculos || data.vehiculos.length === 0) {
            mostrarMensajeSinResultados();
            totalPaginas = 1;
            document.getElementById("numeroPagina").textContent = "1"; // Muestra la primera página
            return;
        }

        mostrarVehiculos(data.vehiculos);  // Muestra los vehículos encontrados

        paginaActual = data.paginaActual;
        totalPaginas = data.totalPaginas;

        document.getElementById("numeroPagina").textContent = paginaActual; // Muestra la página actual

    } catch (error) {
        mostrarMensaje("No se pudo conectar al servidor", "error", "mensaje-filtros");
    }
}

// Obtiene los valores de los filtros del formulario
function obtenerFiltrosBusqueda() {
    return {
        marca: document.getElementById('marca').value.trim(),
        modelo: document.getElementById('modelo').value.trim(),
        anno_min: document.getElementById('minAnno').value,
        anno_max: document.getElementById('maxAnno').value,
        precio_min: document.getElementById('minPrecio').value,
        precio_max: document.getElementById('maxPrecio').value,
        estado: document.getElementById('estado').value
    };
}

// Valida los datos antes de enviar la búsqueda
function validarFiltros(filtros) {
    const { anno_min, anno_max, precio_min, precio_max } = filtros;

    // Valida que los años y precios no sean negativos
    if (anno_min && Number(anno_min) < 0) {
        mostrarMensaje("El año mínimo no puede ser negativo", "error", "mensaje-filtros");
        refrescarSinBusqueda();
        return false;
    }

    if (anno_max && Number(anno_max) < 0) {
        mostrarMensaje("El año máximo no puede ser negativo", "error", "mensaje-filtros");
        refrescarSinBusqueda();
        return false;
    }

    if (precio_min && Number(precio_min) < 0) {
        mostrarMensaje("El precio mínimo no puede ser negativo", "error", "mensaje-filtros");
        refrescarSinBusqueda();
        return false;
    }

    if (precio_max && Number(precio_max) < 0) {
        mostrarMensaje("El precio máximo no puede ser negativo", "error", "mensaje-filtros");
        refrescarSinBusqueda();
        return false;
    }

     // Valida que el año mínimo no sea mayor que el máximo y lo mismo para los precios
    if (anno_min && anno_max && Number(anno_min) > Number(anno_max)) {
        mostrarMensaje("El año mínimo no puede ser mayor al año máximo", "error", "mensaje-filtros");
        return false;
    }

    if (precio_min && precio_max && Number(precio_min) > Number(precio_max)) {
        mostrarMensaje("El precio mínimo no puede ser mayor al precio máximo", "error", "mensaje-filtros");
        return false;
    }

    return true;
}

// Muestra mensaje cuando no hay resultados
function mostrarMensajeSinResultados() {
    const contenedor = document.getElementById('vehiculosContainer');
    contenedor.innerHTML = `
        <div class="col-12 text-center mt-5 mensaje-vacio">
            <h4>No se encontraron vehículos</h4>
            <p>Intenta cambiar los filtros de búsqueda.</p>
        </div>
    `;
}

// Funciones para navegar entre las páginas de resultados
function paginaSiguiente() {
    if (paginaActual < totalPaginas) {
        paginaActual++;
        ejecutarBusqueda(paginaActual);// Ejecuta la búsqueda para la siguiente página
    }
}

function paginaAnterior() {
    if (paginaActual > 1) {
        paginaActual--;
        ejecutarBusqueda(paginaActual);  // Ejecuta la búsqueda para la página anterior
    }
}

function refrescar() {
    history.replaceState(null, "", window.location.pathname);
    limpiarCampos();
    limpiarMensaje("mensaje-filtros");
    paginaActual = 1;
    ejecutarBusqueda(1);
}

function refrescarSinBusqueda() {
    history.replaceState(null, "", window.location.pathname);
    limpiarCampos();
    paginaActual = 1;
}

function limpiarCampos() {
    document.getElementById('marca').value = "";
    document.getElementById('modelo').value = "";
    document.getElementById('minAnno').value = "";
    document.getElementById('maxAnno').value = "";
    document.getElementById('minPrecio').value = "";
    document.getElementById('maxPrecio').value = "";
    document.getElementById('estado').value = "";
}

initFiltroVehiculos();