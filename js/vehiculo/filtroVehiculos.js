let paginaActual = 1;
let totalPaginas = 1;

// --- Función principal: inicializa la página ---
async function initFiltroVehiculos() {
    verificarUsuario();
    await ejecutarBusqueda(1);
}

// Ejecuta la búsqueda de vehículos con filtros y paginación
async function ejecutarBusqueda(page = paginaActual) {
    try {
        paginaActual = page;

        limpiarMensaje("mensaje-filtros");

        const filtros = obtenerFiltrosBusqueda();

        if (!validarFiltros(filtros)) {
            return;
        }

        const limit = 3;
        const params = new URLSearchParams();

        if (filtros.marca) params.append('marca', filtros.marca);
        if (filtros.modelo) params.append('modelo', filtros.modelo);
        if (filtros.anno_min) params.append('anno_min', filtros.anno_min);
        if (filtros.anno_max) params.append('anno_max', filtros.anno_max);
        if (filtros.precio_min) params.append('precio_min', filtros.precio_min);
        if (filtros.precio_max) params.append('precio_max', filtros.precio_max);
        if (filtros.estado) params.append('estado', filtros.estado);

        params.append('page', paginaActual);
        params.append('limit', limit);

        history.replaceState(null, "", "?" + params.toString());

        const response = await fetch(`${apiBaseUrl}/api/vehiculos/filtro?${params.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.message || "No se pudo realizar la búsqueda", "error", "mensaje-filtros");
            document.getElementById('vehiculosContainer').innerHTML = '';
            return;
        }

        if (!data.vehiculos || data.vehiculos.length === 0) {
            mostrarMensajeSinResultados();
            document.getElementById("numeroPagina").textContent = "1";
            return;
        }

        mostrarVehiculos(data.vehiculos);

        paginaActual = data.paginaActual;
        totalPaginas = data.totalPaginas;

        document.getElementById("numeroPagina").textContent = paginaActual;

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

function paginaSiguiente() {
    if (paginaActual < totalPaginas) {
        paginaActual++;
        ejecutarBusqueda(paginaActual);
    }
}

function paginaAnterior() {
    if (paginaActual > 1) {
        paginaActual--;
        ejecutarBusqueda(paginaActual);
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