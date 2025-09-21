   function enviarWhatsApp() {
            // Recopilar datos del formulario
            const form = document.getElementById('projectForm');
            
            // Validar que los campos requeridos estén llenos
            if (!form.checkValidity()) {
                alert('Por favor, completa todos los campos requeridos (*)');
                return;
            }

            // Obtener valores del formulario
            const nombre = document.getElementById('nombreCompleto').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const nombreProyecto = document.getElementById('nombreProyecto').value;
            const actividad = document.getElementById('actividad').value;
            const descripcion = document.getElementById('descripcionProyecto').value;
            const objetivo = document.getElementById('objetivoPrincipal').value;
            const expectativas = document.getElementById('expectativas').value;
            const presupuesto = document.getElementById('presupuesto').options[document.getElementById('presupuesto').selectedIndex].text;
            const tiempo = document.getElementById('tiempo').options[document.getElementById('tiempo').selectedIndex].text;

            // Obtener tipos de proyecto seleccionados
            const tiposProyecto = [];
            document.querySelectorAll('input[name="tipoProyecto"]:checked').forEach(checkbox => {
                tiposProyecto.push(checkbox.value);
            });

            if (tiposProyecto.length === 0) {
                alert('Por favor, selecciona al menos un tipo de proyecto');
                return;
            }

            // Construir mensaje de WhatsApp
            let mensaje = `*INFORMACIÓN DE CONTACTO*\n\n`;
            mensaje += `📌 *Nombre:* ${nombre}\n`;
            mensaje += `📧 *Email:* ${email}\n`;
            mensaje += `📱 *Teléfono:* ${telefono}\n`;
            mensaje += `🏢 *Proyecto/Empresa:* ${nombreProyecto}\n`;
            mensaje += `💼 *Actividad principal:* ${actividad}\n\n`;
            
            mensaje += `*DESCRIPCIÓN DEL PROYECTO*\n\n`;
            mensaje += `📝 *Descripción:* ${descripcion}\n\n`;
            mensaje += `🎯 *Objetivo:* ${objetivo}\n\n`;
            mensaje += `✨ *Expectativas:* ${expectativas}\n\n`;
            
            mensaje += `*DETALLES TÉCNICOS*\n\n`;
            mensaje += `🔧 *Tipo de proyecto:* ${tiposProyecto.join(', ')}\n`;
            mensaje += `💰 *Presupuesto:* ${presupuesto}\n`;
            mensaje += `⏰ *Tiempo esperado:* ${tiempo}`;

            // Codificar el mensaje para URL
            const mensajeCodificado = encodeURIComponent(mensaje);
            
            // Número de WhatsApp (reemplaza con tu número)
            const numeroWhatsApp = '527443328948'; // Formato: código de país + número
            
            // Abrir WhatsApp
            window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`, '_blank');
        }