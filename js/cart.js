document.addEventListener("DOMContentLoaded", () => {
    const carritoLS= JSON.parse(localStorage.getItem('cart')) || [];
    const carritoTable = document.getElementById('tableCart');
    const total = document.getElementById('total');
    

 
    // Cargar productos en la tabla del carrito
    async function cargarCarrito(carritoLS, carritoTable) {
        let total = 0;
      
        for (const item of carritoLS) {
          const producto = await getProductoId(item.id); // Obtener producto
          const fila = document.createElement('tr');
      
          // Imagen del producto
          const imgCelda = document.createElement('td');
          const img = document.createElement('img');
          imgCelda.classList.add('prod-img');
          img.src = producto.images[0];
          img.alt = producto.title;
          imgCelda.appendChild(img);
          fila.appendChild(imgCelda);
      
          // Nombre del producto
          const nombreCelda = document.createElement('td');
          nombreCelda.classList.add('prod-name');
          nombreCelda.colSpan = 2;
          nombreCelda.textContent = producto.title;
          fila.appendChild(nombreCelda);
      
          // Precio del producto
          const precioCelda = document.createElement('td');
          precioCelda.classList.add('prod-price');
          precioCelda.textContent = `$${producto.price.toFixed(2)}`;
          fila.appendChild(precioCelda);
      
          // Cantidad
          const cantidadCelda = document.createElement('td');
          cantidadCelda.classList.add('prod-count');
          cantidadCelda.textContent = item.quantity;
          fila.appendChild(cantidadCelda);
      
          // Subtotal
          const subtotalCelda = document.createElement('td');
          const subtotal = item.quantity * producto.price;
          subtotalCelda.textContent = `$${subtotal.toFixed(2)}`;
          fila.appendChild(subtotalCelda);
      
          // Botón de eliminar
          const eliminarCelda = document.createElement('td');
          eliminarCelda.classList.add('prod-delete');
          eliminarCelda.innerHTML = "<i class='bx bx-trash-alt'></i>";
          fila.appendChild(eliminarCelda);
      
          // Escuchar evento para eliminar producto
          eliminarCelda.addEventListener('click', () => {
            eliminarProductoDelCarrito(item.id);
          });
      
          // Agregar fila a la tabla
          carritoTable.appendChild(fila);
      
          // Sumar al total
          total += subtotal;
        }
      
        // Actualizar el total en el DOM
        actualizarTotal(total);
      }
      
      async function getProductoId(idProducto) {
        try {
          if (idProducto.startsWith("json")) {
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
      
      // Función para eliminar producto del carrito
      function eliminarProductoDelCarrito(idProducto) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(producto => producto.id !== idProducto);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Producto eliminado del carrito!");
        location.reload();
      }
      
      // Función para actualizar el total en el DOM
      function actualizarTotal(total) {
        const totalGral = document.querySelector("#total");
        if (totalGral) {
          totalGral.textContent =`$${total.toFixed(2)}`;
        }
      }
      

    // // Botón para limpiar el carrito y volver al inicio
    // document.getElementById('limpiar-carrito').addEventListener('click', () => 
    // {
    //     localStorage.removeItem('cart'); 
    //     window.location.href = 'index.html'; 
    // });

    // Botón para finalizar la compra con sweet Alert
    document.getElementById('comprar').addEventListener('click', () => 
    {
        Swal.fire({
            title: 'Compra Confirmada',
            text: 'Se ha procesado la compra #1200',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

        // Limpiar el carrito después de finalizar la compra
        localStorage.removeItem('cart'); 
        
        // Redirigir al inicio despues de 4 segundos
        setTimeout(() => {
        window.location.href = '../index.html'; 
        }, 3000);     
    });

cargarCarrito(carritoLS,carritoTable);
});