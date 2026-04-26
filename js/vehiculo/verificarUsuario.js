let usuarioPayload = null;

// Verifica si hay usuario logueado y configura el header
function verificarUsuario() {
    const token = sessionStorage.getItem("token");

    const nombreCont = document.getElementById("nombreUsuario");
    const botonesCont = document.getElementById("botonesUsuario");
    const menuCont = document.getElementById("menuOpciones");

    // Si no existen los elementos, no hace nada
    if (!nombreCont || !botonesCont || !menuCont) return;

    // Detecta en qué página está
    const estoyEnDetalle = window.location.pathname.includes("/html/vehiculo/verInfoVehiculo.html");
    const estoyEnGestion = window.location.pathname.includes("/html/vehiculo/gestionVehiculo.html");

    // Decodifica el token para obtener datos del usuario
    if (token) {
        try {
            usuarioPayload = JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            usuarioPayload = null; // Token inválido
        }
    } else {
        usuarioPayload = null; // No hay sesión
    }

    // Si NO hay usuario logueado
    if (!usuarioPayload) {
        nombreCont.innerHTML = "";

        // Solo muestra botón regresar en ciertas páginas
        if (estoyEnDetalle || estoyEnGestion) {
            menuCont.innerHTML = `
                <button class="nav-btn btn-regresar" onclick="regresar()">
                    <i class="bi bi-arrow-left"></i> Regresar
                </button>
            `;
        } else {
            menuCont.innerHTML = "";
        }

        // Botones de acceso
        botonesCont.innerHTML = `
            <a href="/html/usuario/inicioSesion.html" class="nav-btn btn-gestion">
                Iniciar Sesión
            </a>
            <a href="/html/usuario/registro.html" class="nav-btn btn-gestion">
                Registrarse
            </a>
        `;
    } 
    // Si hay usuario logueado
    else {
        nombreCont.innerHTML = `👤 ${usuarioPayload.nombre}`;

        // Menú dependiendo de la página
        if (estoyEnGestion) {
            menuCont.innerHTML = `
                <button class="nav-btn btn-regresar" onclick="regresar()">
                    <i class="bi bi-arrow-left"></i> Regresar
                </button>

                <a href="/html/vehiculo/formularioVehiculo.html" class="nav-btn btn-crear">
                    <i class="bi bi-plus-circle"></i> Crear Vehiculo
                </a>
            `;
        }
        else if (estoyEnDetalle) {
            menuCont.innerHTML = `
                <button class="nav-btn btn-regresar" onclick="regresar()">
                    <i class="bi bi-arrow-left"></i> Regresar
                </button>

                <a href="/html/vehiculo/gestionVehiculo.html" class="nav-btn btn-gestion">
                    <i class="bi bi-gear"></i> Gestión Vehículos
                </a>

                <a href="/html/conversacion/conversacion.html" class="nav-btn btn-chat">
                    <i class="bi bi-chat-dots"></i> Chat
                </a>
            `;
        }
        else {
            menuCont.innerHTML = `
                <a href="/html/vehiculo/gestionVehiculo.html" class="nav-btn btn-gestion">
                    <i class="bi bi-gear"></i> Gestión Vehículos
                </a>

                <a href="/html/conversacion/conversacion.html" class="nav-btn btn-chat">
                    <i class="bi bi-chat-dots"></i> Chat
                </a>
            `;
        }

        // Botón cerrar sesión
        botonesCont.innerHTML = `
            <button onclick="cerrarSesion()" class="nav-btn btn-regresar">
             Cerrar sesión
            </button>
        `;
    }
}

// Cierra sesión eliminando el token
function cerrarSesion() {
    sessionStorage.removeItem("token");
    window.location.href = "/html/usuario/inicioSesion.html";
}

// Maneja el botón de regresar según la página
function regresar() {
    const rutaActual = window.location.pathname;

    if (rutaActual.includes("/html/vehiculo/formularioVehiculo.html")) {
        window.location.href = "/html/vehiculo/gestionVehiculo.html";
    } else {
        window.location.href = "/index.html";
    }
}