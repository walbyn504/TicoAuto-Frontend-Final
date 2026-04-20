const apiBaseUrl = 'http://localhost:3001';
const token = sessionStorage.getItem('token');


// --- Función principal: inicializa la página ---
async function initVehiculo() {

    limpiarMensaje("mensaje-form-vehiculo");

    if (!token) {
        mostrarMensaje("Debe iniciar sesión", "error", "mensaje-form-vehiculo");

        setTimeout(() => {
            location.href = "/html/usuario/inicioSesion.html";
        }, 2500);
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        await cargarVehiculo(id);
    }
}

// --- Cargar vehículo para edición ---
async function cargarVehiculo(id) {

    try {
        limpiarMensaje("mensaje-form-vehiculo");

        const query = `
            query {
                obtenerVehiculoEdicion(id: "${id}") {
                    _id
                    marca
                    modelo
                    anno
                    precio
                    imagen
                    combustible
                    color
                    transmision
                    condicion
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
            const mensaje = data?.errors?.[0]?.message || "No se pudo cargar el vehículo";
            throw new Error(mensaje);
        }

        const vehiculo = data.data.obtenerVehiculoEdicion;
        llenarFormulario(vehiculo);

    } catch (error) {
        mostrarMensaje(error.message || "No se pudo cargar el vehículo", "error", "mensaje-form-vehiculo");
    }
}

// --- Llenar formulario con los datos del vehículo ---
function llenarFormulario(vehiculo) {
    const form = document.getElementById('formVehiculo');
    form.vehiculoId.value = vehiculo._id;
    form.marca.value = vehiculo.marca;
    form.modelo.value = vehiculo.modelo;
    form.anno.value = vehiculo.anno;
    form.precio.value = vehiculo.precio;
    form.combustible.value = vehiculo.combustible;
    form.color.value = vehiculo.color;
    form.transmision.value = vehiculo.transmision;
    form.condicion.value = vehiculo.condicion;

    if (vehiculo.imagen) {
        const preview = document.getElementById('vistaPrevia');
        preview.src = `${apiBaseUrl}/imagenes/${vehiculo.imagen}`;
        preview.style.display = 'block';
    }
}

async function guardarVehiculo() {
    const form = document.getElementById('formVehiculo');
    const id = form.vehiculoId.value;
    const marca = form.marca.value.trim();
    const modelo = form.modelo.value.trim();
    const anno = parseInt(form.anno.value);
    const precio = parseFloat(form.precio.value);
    const combustible = form.combustible.value;
    const color = form.color.value.trim();
    const transmision = form.transmision.value;
    const condicion = form.condicion.value;
    const imagen = document.getElementById("imagen").files[0];

    limpiarMensaje("mensaje-form-vehiculo");

    if (!marca || !modelo || !color || isNaN(anno) || isNaN(precio) || !combustible || !transmision || !condicion) {
        mostrarMensaje("Complete todos los campos correctamente", "error", "mensaje-form-vehiculo");
        return;
    }

    if (anno < 0) {
        mostrarMensaje("El año no puede ser negativo", "error", "mensaje-form-vehiculo");
        return;
    }

    if (precio < 0) {
        mostrarMensaje("El precio no puede ser negativo", "error", "mensaje-form-vehiculo");
        return;
    }

    if (!id && !imagen) {
        mostrarMensaje("Seleccione una imagen para el vehículo", "error", "mensaje-form-vehiculo");
        return;
    }

    const formData = new FormData();
    formData.append('marca', marca);
    formData.append('modelo', modelo);
    formData.append('anno', anno);
    formData.append('precio', precio);
    formData.append('combustible', combustible);
    formData.append('color', color);
    formData.append('transmision', transmision);
    formData.append('condicion', condicion);

    if (imagen) {
        formData.append('imagen', imagen);
    }

    try {
        const response = await fetch(
            id ? `${apiBaseUrl}/api/vehiculo/${id}` : `${apiBaseUrl}/api/vehiculo`,
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.message || "No se pudo guardar el vehículo", "error", "mensaje-form-vehiculo");
            return;
        }

        // guardar mensaje y redirigir
        sessionStorage.setItem(
            'mensajeGlobal',
            id ? "Vehículo actualizado" : "Vehículo creado"
        );

        sessionStorage.setItem('tipoMensaje', 'success');

        setTimeout(() => {
            location.href = '/html/vehiculo/gestionVehiculo.html';
        }, 1000);

    } catch (error) {
        mostrarMensaje("No se pudo conectar al servidor", "error", "mensaje-form-vehiculo");
    }
}

// --- Regresar al índice ---
function regresar() {
    location.href = '/html/vehiculo/gestionVehiculo.html';
}

// --- Inicializar al cargar la página ---
initVehiculo();