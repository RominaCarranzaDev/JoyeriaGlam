document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/" || window.location.pathname.includes("index.html")) {
    document.getElementById("form-contacto").addEventListener("submit", (event) => {
        event.preventDefault();
        if (validarFormulario()) {
          alert("Formulario válido. ¡Gracias por contactarnos!");
          event.target.submit();
        } else {
          alert("Por favor, completa todos los campos correctamente.");
        }
      });
    }

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

    actualizarTotal();
  });

async function getProductoId(idProducto) {
    try {
        if (String(idProducto).startsWith("json")) {
        const responseJ = await fetch('../json/products.json');
        const productosJson = await responseJ.json();

        // Buscar el producto en el archivo JSON
        const producto = productosJson.find(prod => prod.id === idProducto);
        if (producto) {
            return producto;
        }
        }

        const response = await fetch(`https://dummyjson.com/products/${idProducto}`);
        const producto = await response.json();
        return producto;
    } catch (error) {
    console.error("Error al obtener el producto:", error);
    }
}

function actualizarTotal (){ 
    let numberTotal = document.querySelector('span.totalItems');
    let totalItems = obtenerCantidadCarrito();
    if (!totalItems) {
      numberTotal.style.display = "none"; 
    } else {
      numberTotal.style.display = "flex";
      numberTotal.textContent = totalItems;
    }
  }
  
  function obtenerCantidadCarrito() {
    // Obtener el carrito del localStorage (puede ser un array de objetos)
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Sumar todas las cantidades de los productos en el carrito
    let totalItems = cart.reduce((total, producto) => total + producto.quantity, 0);
    if (totalItems == 0) {
      totalItems = null;
    }
    return totalItems;
  }
  