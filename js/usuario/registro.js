const apiBaseUrl = 'http://localhost:3001';

async function consultarCedula() {
    const cedula = document.getElementById('cedula').value.trim();

    if (!cedula) {
        mostrarMensaje('La cédula es obligatoria', 'error', "contenedor-mensajes");
        return;
    }

    const regexCedula = /^\d{9}$/;
    if (!regexCedula.test(cedula)) {
        mostrarMensaje('La cédula debe tener exactamente 9 dígitos', 'error', "contenedor-mensajes");
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/padron/${cedula}`);
        const data = await response.json();

        if (!response.ok) {
            document.getElementById('nombre').value = '';
            document.getElementById('primerApellido').value = '';
            document.getElementById('segundoApellido').value = '';
            mostrarMensaje(data.message || 'La cédula no fue encontrada en el padrón', 'error', "contenedor-mensajes");
            return;
        }

        document.getElementById('nombre').value = data.nombre || '';
        document.getElementById('primerApellido').value = data.apellidoPaterno || '';
        document.getElementById('segundoApellido').value = data.apellidoMaterno || '';

        mostrarMensaje('Cédula validada correctamente', 'success', "contenedor-mensajes");

    } catch (error) {
        mostrarMensaje('No se pudo consultar el padrón', 'error', "contenedor-mensajes");
    }
}

async function registrarUsuario() {
    const cedula = document.getElementById('cedula').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const primerApellido = document.getElementById('primerApellido').value.trim();
    const segundoApellido = document.getElementById('segundoApellido').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasenna = document.getElementById('contrasenna').value.trim();

    if (!cedula || !nombre || !primerApellido || !segundoApellido || !telefono || !correo || !contrasenna) {
        mostrarMensaje('Todos los campos son obligatorios', 'error', "contenedor-mensajes");
        return;
    }

    const regexCedula = /^\d{9}$/;
    if (!regexCedula.test(cedula)) {
        mostrarMensaje('La cédula debe tener exactamente 9 dígitos', 'error', "contenedor-mensajes");
        return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        mostrarMensaje('El formato del correo no es válido', 'error', "contenedor-mensajes");
        return;
    }

    const regexTelefono = /^[0-9]{8,}$/;
    if (!regexTelefono.test(telefono)) {
        mostrarMensaje('El teléfono debe tener al menos 8 dígitos', 'error', "contenedor-mensajes");
        return;
    }

    const tieneMin = /[a-z]/.test(contrasenna);
    const tieneMay = /[A-Z]/.test(contrasenna);
    const tieneNumero = /\d/.test(contrasenna);
    const tieneEspecial = /[@$!%*?&.#_-]/.test(contrasenna);
    const largoMinimo = contrasenna.length >= 8;

    if (!(tieneMin && tieneMay && tieneNumero && tieneEspecial && largoMinimo)) {
        mostrarMensaje(
            'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.',
            'error',
            "contenedor-mensajes"
        );
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/autenticacion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula,
                telefono,
                correo,
                contrasenna
            })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.message || 'No se pudo registrar el usuario', 'error', "contenedor-mensajes");
            return;
        }

        mostrarMensaje(data.message || 'Usuario registrado correctamente', 'success', "contenedor-mensajes");

        setTimeout(() => {
            location.href = "/html/usuario/inicioSesion.html";
        }, 1000);

    } catch (error) {
        mostrarMensaje('No se pudo conectar al servidor', 'error', "contenedor-mensajes");
    }
}