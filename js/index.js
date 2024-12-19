document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById("form-contacto").addEventListener("submit", (event) => {
        event.preventDefault();
        if (validarFormulario()) {
          alert("Formulario válido. ¡Gracias por contactarnos!");
          event.target.submit();
        } else {
          alert("Por favor, completa todos los campos correctamente.");
        }
      });
      
    function validarFormulario() {
    let esValido = true;
    
    // Valida el campo de nombre
    const nombre = document.getElementById("name");
    if (nombre.value.trim() === "" || nombre.value.length < nombre.minLength) {
        esValido = false;
        alert("El nombre es requerido y debe tener al menos 1 carácter.");
    }
    
    // Valida el campo de correo electrónico
    const email = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "" || !emailRegex.test(email.value)) {
        esValido = false;
        alert("Por favor, ingresa un correo electrónico válido.");
    }
    
    return esValido;
    }



  });
  
