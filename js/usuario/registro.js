const apiBaseUrl = 'http://localhost:3001';

async function registrarUsuario() {
    const nombre = document.getElementById('nombre').value.trim();
    const primerApellido = document.getElementById('primerApellido').value.trim();
    const segundoApellido = document.getElementById('segundoApellido').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasenna = document.getElementById('contrasenna').value.trim();

    if (!nombre || !primerApellido || !segundoApellido || !telefono || !correo || !contrasenna) {
        mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        mostrarMensaje('El formato del correo no es válido', 'error');
        return;
    }

    const regexTelefono = /^[0-9]{8,}$/;
    if (!regexTelefono.test(telefono)) {
        mostrarMensaje('El teléfono debe tener al menos 8 dígitos', 'error');
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
            'error'
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
                nombre,
                primerApellido,
                segundoApellido,
                telefono,
                correo,
                contrasenna
            })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.message || 'No se pudo registrar el usuario', 'error');
            return;
        }

        mostrarMensaje(data.message || 'Usuario registrado correctamente', 'success');

        setTimeout(() => {
            location.href = "/html/usuario/inicioSesion.html";
        }, 1000);

    } catch (error) {
        mostrarMensaje('No se pudo conectar al servidor', 'error');
    }
}