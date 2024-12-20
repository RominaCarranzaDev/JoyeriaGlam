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
        <div id="img_${product.id}" class="container-img">
          <img src="${product.images[0]}" alt="${product.title}"loading="lazy">
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


    // Evento a las card
    const cardsImg = document.querySelectorAll(".card-product img");
    cardsImg.forEach((cardImg) => {
      cardImg.addEventListener("click", async () => {
        const card = cardImg.closest(".card-product");
        const productId = card.querySelector(".btn-add").dataset.prod;
        //console.log("ID del producto:", productId);
        const producto = await getProductoId(productId);
        createModal(producto)
      })
    })

      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
}


 // Función para agregar al carrito usando localStorage
 async function agregarAlCarrito(producto) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productoExistente = cart.find(prod => prod.id === producto.id);
      // Si el producto ya existe, actualiza la cantidad
  if (productoExistente) {
    productoExistente.quantity += producto.quantity;
  } else {
    cart.push(producto);
  }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${producto.name} ha sido agregado al carrito!`);
}



function createModal(product) {
  // Crear contenedor del modal
  const modal = document.createElement("div");
  modal.id = "productModal";
  const modalContent = document.createElement("div");
  modalContent.classList.add('modal-content');
  const closeModal = document.createElement("span");
  closeModal.textContent = "X";
  closeModal.classList.add('close-modal');

  closeModal.addEventListener("click", () => {
    modal.remove();
  });

  // Imagen del producto
  const img = document.createElement("img");
  img.src = product.images[0];
  img.alt = product.title;
  
  // Título del producto
  const title = document.createElement("h2");
  title.textContent = product.title;

  // Descripción del producto
  const description = document.createElement("p");
  description.textContent = product.description;

  // Precio del producto
  const price = document.createElement("p");
  price.innerHTML = `<strong>Precio:</strong> $${product.price.toFixed(2)}`;

  // Botón para agregar al carrito
  const addToCartButton = document.createElement("button");
  addToCartButton.innerHTML  = `<i class='bx bx-cart-add'></i>COMPRAR`;
  addToCartButton.classList.add('btn-add', 'btn', 'btn_form');
  addToCartButton.setAttribute('data-prod', product.id)

  addToCartButton.addEventListener("click", () => {
    let productoCart = {
      'id': `${product.id}`,
      'quantity': 1,
      'name': product.title
    };
       agregarAlCarrito(productoCart);
       actualizarTotal();
    modal.remove();
  });

  // Agregar elementos al modal
  modalContent.appendChild(closeModal);
  modalContent.appendChild(img);
  modalContent.appendChild(title);
  modalContent.appendChild(description);
  modalContent.appendChild(price);
  modalContent.appendChild(addToCartButton);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);
}


actualizarTotal();
// Carga inicial de productos
fetchProductos();

 // Obtener el fragmento de la URL
 const redireccion = window.location.hash;
 if (redireccion) {
   const espera = setInterval(() => {
     const card = document.querySelector(redireccion);
     if (card) {
       card.scrollIntoView({ behavior: 'smooth', block: 'center' });
       clearInterval(espera);
     }
   }, 100);
 }
});