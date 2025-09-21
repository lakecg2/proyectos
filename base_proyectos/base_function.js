 function cargarProyectosUrgentes() {
            const proyectosGuardados = localStorage.getItem('proyectos');
            const tbody = document.getElementById('tabla-urgentes');
            const mensajeVacio = document.getElementById('mensaje-vacio');
            
            tbody.innerHTML = '';
            
            if (proyectosGuardados) {
                const proyectos = JSON.parse(proyectosGuardados);
                const hoy = new Date();
                const proyectosUrgentes = [];

                proyectos.forEach(proyecto => {
                    const fechaEntrega = new Date(proyecto.fechaEntrega);
                    const diferenciaDias = Math.ceil((fechaEntrega - hoy) / (1000 * 60 * 60 * 24));
                    
                    // Considerar urgente si: prioridad alta, o faltan menos de 7 días, o está en progreso y faltan menos de 14 días
                    const esUrgente = proyecto.prioridad === 'Alta' || 
                                    diferenciaDias <= 7 || 
                                    (proyecto.estado === 'En Progreso' && diferenciaDias <= 14);
                    
                    if (esUrgente && proyecto.estado !== 'Completado') {
                        proyectosUrgentes.push({...proyecto, diasRestantes: diferenciaDias});
                    }
                });

                // Ordenar por días restantes (menos días primero)
                proyectosUrgentes.sort((a, b) => a.diasRestantes - b.diasRestantes);

                if (proyectosUrgentes.length === 0) {
                    mensajeVacio.style.display = 'block';
                } else {
                    mensajeVacio.style.display = 'none';
                    
                    proyectosUrgentes.forEach(proyecto => {
                        const fila = document.createElement('tr');
                        
                        // Colorear según urgencia
                        let claseUrgencia = '';
                        if (proyecto.diasRestantes < 0) {
                            claseUrgencia = 'vencido';
                        } else if (proyecto.diasRestantes <= 3) {
                            claseUrgencia = 'muy-urgente';
                        } else if (proyecto.diasRestantes <= 7) {
                            claseUrgencia = 'urgente';
                        }
                        
                        fila.className = claseUrgencia;
                        
                        let textosDias = proyecto.diasRestantes < 0 ? 
                            `${Math.abs(proyecto.diasRestantes)} días vencido` : 
                            `${proyecto.diasRestantes} días`;
                        
                        fila.innerHTML = `
                            <td>${proyecto.nombre}</td>
                            <td>${proyecto.fechaInicio}</td>
                            <td>${proyecto.fechaEntrega}</td>
                            <td>${proyecto.estado}</td>
                            <td>${proyecto.prioridad}</td>
                            <td>${textosDias}</td>
                        `;
                        tbody.appendChild(fila);
                    });
                }
            } else {
                mensajeVacio.style.display = 'block';
            }
        }

        // Cargar proyectos urgentes al cargar la página
        window.onload = cargarProyectosUrgentes;
        
        // Actualizar cada minuto para mantener los días restantes actualizados
        setInterval(cargarProyectosUrgentes, 60000);