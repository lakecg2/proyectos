const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Sirve archivos estáticos

// Ruta del archivo CSV
const CSV_FILE = path.join(__dirname, 'proyectos.csv');

// Función para leer el CSV
function leerCSV() {
    try {
        const data = fs.readFileSync(CSV_FILE, 'utf8');
        const lines = data.split('\n').filter(line => line.trim());
        const proyectos = [];
        
        // Saltar la primera línea (encabezados)
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(col => col.replace(/"/g, '').trim());
            if (cols.length >= 5) {
                proyectos.push({
                    nombre: cols[0],
                    fechaInicio: cols[1],
                    fechaEntrega: cols[2],
                    estado: cols[3],
                    prioridad: cols[4]
                });
            }
        }
        return proyectos;
    } catch (error) {
        console.error('Error leyendo CSV:', error);
        return [];
    }
}

// Función para guardar en CSV
function guardarCSV(proyectos) {
    let csvContent = "Nombre del Proyecto,Fecha de Inicio,Fecha de Entrega,Estado,Prioridad\n";
    
    proyectos.forEach(proyecto => {
        csvContent += `"${proyecto.nombre}","${proyecto.fechaInicio}","${proyecto.fechaEntrega}","${proyecto.estado}","${proyecto.prioridad}"\n`;
    });
    
    fs.writeFileSync(CSV_FILE, csvContent, 'utf8');
}

// Endpoints API

// Obtener todos los proyectos
app.get('/api/proyectos', (req, res) => {
    const proyectos = leerCSV();
    res.json(proyectos);
});

// Guardar todos los proyectos (reemplaza el archivo completo)
app.post('/api/proyectos', (req, res) => {
    try {
        const proyectos = req.body;
        guardarCSV(proyectos);
        res.json({ success: true, message: 'Proyectos guardados correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Agregar un nuevo proyecto
app.post('/api/proyectos/agregar', (req, res) => {
    try {
        const proyectos = leerCSV();
        proyectos.push(req.body);
        guardarCSV(proyectos);
        res.json({ success: true, message: 'Proyecto agregado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Actualizar un proyecto
app.put('/api/proyectos/:index', (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const proyectos = leerCSV();
        
        if (index >= 0 && index < proyectos.length) {
            proyectos[index] = req.body;
            guardarCSV(proyectos);
            res.json({ success: true, message: 'Proyecto actualizado correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Eliminar un proyecto
app.delete('/api/proyectos/:index', (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const proyectos = leerCSV();
        
        if (index >= 0 && index < proyectos.length) {
            proyectos.splice(index, 1);
            guardarCSV(proyectos);
            res.json({ success: true, message: 'Proyecto eliminado correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    
    // Crear archivo CSV si no existe
    if (!fs.existsSync(CSV_FILE)) {
        fs.writeFileSync(CSV_FILE, "Nombre del Proyecto,Fecha de Inicio,Fecha de Entrega,Estado,Prioridad\n", 'utf8');
        console.log('Archivo CSV creado');
    }
});