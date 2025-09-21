let proyectos = [];
let filaEditando = null;

// URL del backend
const API_URL = 'http://localhost:3000/api';

// Cargar proyectos al iniciar
window.onload = function() {
    cargarProyectosDesdeAPI();
}

// Cargar proyectos desde el servidor
async function cargarProyectosDesdeAPI() {
    try {
        const response = await fetch(`${API_URL}/proyectos`);
        proyectos = await response.json();
        actualizarTabla();
    } catch (error) {
        console.error('Error cargando proyectos:', error);
        alert('Error al cargar los proyectos del servidor');
    }
}

// Guardar todos los proyectos en el servidor
async function guardarEnServidor() {
    try {
        const response = await fetch(`${API_URL}/proyectos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proyectos)
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('Proyectos guardados en CSV correctamente');
        }
    } catch (error) {
        console.error('Error guardando proyectos:', error);
        alert('Error al guardar en el servidor');
    }
}

function mostrarModalAgregar() {
    document.getElementById('tituloModal').textContent = 'Agregar Proyecto';
    document.getElementById('formProyecto').reset();
    document.getElementById('modalProyecto').style.display = 'block';
    filaEditando = null;
}

function cerrarModal() {
    document.getElementById('modalProyecto').style.display = 'none';
}

document.getElementById('formProyecto').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const proyecto = {
        nombre: document.getElementById('nombreProyecto').value,
        fechaInicio: document.getElementById('fechaInicio').value,
        fechaEntrega: document.getElementById('fechaEntrega').value,
        estado: document.getElementById('estado').value,
        prioridad: document.getElementById('prioridad').value
    };

    if (filaEditando !== null) {
        proyectos[filaEditando] = proyecto;
    } else {
        proyectos.push(proyecto);
    }

    await guardarEnServidor(); // Guarda automáticamente en el CSV del servidor
    actualizarTabla();
    cerrarModal();
});

function actualizarTabla() {
    const tbody = document.getElementById('tabla-proyectos');
    tbody.innerHTML = '';

    proyectos.forEach((proyecto, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${proyecto.nombre}</td>
            <td>${proyecto.fechaInicio}</td>
            <td>${proyecto.fechaEntrega}</td>
            <td>${proyecto.estado}</td>
            <td>${proyecto.prioridad}</td>
            <td>
                <button class="btn-editar" onclick="editarProyecto(${index})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarProyecto(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function editarProyecto(index) {
    const proyecto = proyectos[index];
    
    document.getElementById('tituloModal').textContent = 'Editar Proyecto';
    document.getElementById('nombreProyecto').value = proyecto.nombre;
    document.getElementById('fechaInicio').value = proyecto.fechaInicio;
    document.getElementById('fechaEntrega').value = proyecto.fechaEntrega;
    document.getElementById('estado').value = proyecto.estado;
    document.getElementById('prioridad').value = proyecto.prioridad;
    
    filaEditando = index;
    document.getElementById('modalProyecto').style.display = 'block';
}

async function eliminarProyecto(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        proyectos.splice(index, 1);
        await guardarEnServidor(); // Guarda automáticamente en el CSV
        actualizarTabla();
    }
}

function buscarProyecto() {
    const termino = document.getElementById('search-bar').value.toLowerCase();
    const filas = document.querySelectorAll('#tabla-proyectos tr');
    
    filas.forEach(fila => {
        const nombre = fila.cells[0].textContent.toLowerCase();
        if (nombre.includes(termino)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modalProyecto');
    if (event.target == modal) {
        cerrarModal();
    }
}