        // Función para mostrar/ocultar la card al hacer scroll
        function handleScroll() {
            const card = document.querySelector('.card');
            const scrollPosition = window.scrollY;
            
            // Aparece cuando el usuario ha scrolleado más de 100px
            if (scrollPosition > 100) {
                card.classList.add('visible');
            } else {
                // Desaparece cuando regresa al inicio
                card.classList.remove('visible');
            }
        }

        // Escuchar el evento de scroll
        window.addEventListener('scroll', handleScroll);