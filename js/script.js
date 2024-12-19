document.addEventListener("DOMContentLoaded", () => {
const containerProducts = document.getElementById('container-products_api');

async function fetchProductos() {
  try {
    // Obtener los productos de la categoría "womens-jewellery"
    const response = await fetch(`https://dummyjson.com/products/category/womens-jewellery`);
    const data = await response.json();
    const responseJson = await fetch('../json/products.json');
    const dataJson= await responseJson.json();
    // Une los productos de la API DummyJson y los del Json 
    const productos = [...data.products, ...dataJson];
    containerProducts.innerHTML = "";

    // Recorrer cada producto y generar la tarjeta
    productos.forEach((product) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card-product";
      cardDiv.innerHTML = `
        <div class="container-img">
          <a href="#"><img src="${product.images[0]}" alt="${product.title}"loading="lazy"></a>
        </div>
        <div class="card-detalles grid">
          <h3 class="card-product_title">${product.title}</h3>
          <p>$ <span class="precio">${product.price}</span></p>
          <div class="botonera">
            <i class='bx bx-minus'></i><span class='number'>0</span><i class='bx bx-plus'></i>
          </div>
          <button class="btn-add btn btn_form" data-prod="${product.id}">
            <i class='bx bx-cart-add'></i>COMPRAR
          </button>
        </div>
      `;

      // Añadir la tarjeta al contenedor
      containerProducts.appendChild(cardDiv);
    });

// Selecciona todas las botoneras
const botoneras = document.querySelectorAll(".botonera");

// Recorre cada botonera y agrega listeners
botoneras.forEach((botonera) => {
  const minusButton = botonera.querySelector(".bx-minus");
  const plusButton = botonera.querySelector(".bx-plus");
  const numberSpan = botonera.querySelector(".number");

  // Agregar listener para restar
  minusButton.addEventListener("click", () => {
    let currentValue = parseInt(numberSpan.textContent, 10);
    if (currentValue > 0) {
      currentValue--;
      numberSpan.textContent = currentValue;
    }
    
  });

  // Agregar listener para sumar
  plusButton.addEventListener("click", () => {
    let currentValue = parseInt(numberSpan.textContent, 10);
    currentValue++;
    numberSpan.textContent = currentValue;
   
  });

 
});




    // Evento al botón "Agregar"
    const botones = document.querySelectorAll(".btn-add");
    botones.forEach((botonAgregar) => {
      botonAgregar.addEventListener("click", () => {
      let padre = botonAgregar.closest(".card-detalles");
      let cantidad = padre.querySelector(".number").textContent;
      let nombre = padre.querySelector(".card-product_title").textContent;
      if (cantidad > 0) {
      let productoCart = {
        'id': botonAgregar.dataset.prod,
        'quantity': parseInt(cantidad),
        'name': nombre
      };
         agregarAlCarrito(productoCart);
         actualizarTotal();
        }
      });
    });

      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
}


 // Función para agregar al carrito usando localStorage
 async function agregarAlCarrito(producto) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productoExistente = cart.find(prod => prod.id === producto.id);
      // Si el producto ya existe, actualizar la cantidad
  if (productoExistente) {
    productoExistente.quantity = producto.quantity;
  } else {
    cart.push(producto);
  }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${producto.name} ha sido agregado al carrito!`);
  
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


actualizarTotal();
// Carga inicial de productos
fetchProductos();
});