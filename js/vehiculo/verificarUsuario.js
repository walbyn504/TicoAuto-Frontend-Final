let usuarioPayload = null;

function verificarUsuario() {
    const token = sessionStorage.getItem("token");

    const nombreCont = document.getElementById("nombreUsuario");
    const botonesCont = document.getElementById("botonesUsuario");
    const menuCont = document.getElementById("menuOpciones");

    if (!nombreCont || !botonesCont || !menuCont) return;

    const estoyEnDetalle = window.location.pathname.includes("/html/vehiculo/verInfoVehiculo.html");
    const estoyEnGestion = window.location.pathname.includes("/html/vehiculo/gestionVehiculo.html");

    if (token) {
        try {
            usuarioPayload = JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            usuarioPayload = null;
        }
    } else {
        usuarioPayload = null;
    }

    if (!usuarioPayload) {
        nombreCont.innerHTML = "";

        if (estoyEnDetalle || estoyEnGestion) {
            menuCont.innerHTML = `
                <button class="nav-btn btn-regresar" onclick="regresar()">
                    <i class="bi bi-arrow-left"></i> Regresar
                </button>
            `;
        } else {
            menuCont.innerHTML = "";
        }

        botonesCont.innerHTML = `
            <a href="/html/usuario/inicioSesion.html" class="nav-btn btn-gestion">
                Iniciar Sesión
            </a>
            <a href="/html/usuario/registro.html" class="nav-btn btn-gestion">
                Registrarse
            </a>
        `;
    } else {
        nombreCont.innerHTML = `👤 ${usuarioPayload.nombre}`;

        // 🔥 BOTONES CON ESTILO PERSONALIZADO
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
                    <i class="bi bi-gear"></i> Gestión
                </a>

                <a href="/html/conversacion/conversacion.html" class="nav-btn btn-chat">
                    <i class="bi bi-chat-dots"></i> Chat
                </a>
            `;
        }
        else {
            menuCont.innerHTML = `
                <a href="/html/vehiculo/gestionVehiculo.html" class="nav-btn btn-gestion">
                    <i class="bi bi-gear"></i> Gestión
                </a>

                <a href="/html/conversacion/conversacion.html" class="nav-btn btn-chat">
                    <i class="bi bi-chat-dots"></i> Chat
                </a>
            `;
        }

        botonesCont.innerHTML = `
            <button onclick="cerrarSesion()" class="nav-btn btn-regresar">
             Cerrar sesión
            </button>
        `;
    }
}

function cerrarSesion() {
    sessionStorage.removeItem("token");
    window.location.href = "/html/usuario/inicioSesion.html";
}

function regresar() {
    const rutaActual = window.location.pathname;

    if (rutaActual.includes("/html/vehiculo/formularioVehiculo.html")) {
        window.location.href = "/html/vehiculo/gestionVehiculo.html";
    } else {
        window.location.href = "/index.html";
    }
}