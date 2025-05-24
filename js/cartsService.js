function getCarts() {
    document.getElementById('cardHeader').innerHTML = '<h3>Lista de Compras</h3>';
    document.getElementById('info').innerHTML = 'Cargando...';

    fetch("https://dummyjson.com/carts", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(result => result.json())
        .then(data => {
            if (data.carts && data.carts.length > 0) {
                let listCarts = `
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Id Carro</th>
                            <th scope="col">Productos Totales</th>
                            <th scope="col">Cantidad total</th>
                            <th scope="col">Precio total</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

                data.carts.forEach(cart => {
                    listCarts += `
                    <tr>
                        <td>${cart.id}</td>
                        <td>${cart.totalProducts}</td>
                        <td>${cart.totalQuantity}</td>
                        <td>$${cart.total.toFixed(2)}</td>
                        <td>
                            <button type="button" class="btn btn-outline-primary" onclick="showInfoCart(${cart.id})">Ver info</button>
                        </td>
                    </tr>
                `;
                });

                listCarts += `
                    </tbody>
                </table>
            `;
                document.getElementById('info').innerHTML = listCarts;
            } else {
                document.getElementById('info').innerHTML = '<h3>No se encontró lista de compras</h3>';
            }
        })
        .catch(err => {
            console.error("Error al obtener la lista de carritos:", err);
            document.getElementById('info').innerHTML = '<p>Error al cargar los datos.</p>';
        });
}

function showInfoCart(cartId) {
    console.log("id:" + cartId);
    fetch(`https://dummyjson.com/carts/${cartId}`)
        .then(res => {
            if (!res.ok) throw new Error('Carrito no encontrado');
            return res.json();
        })
        .then(cart => showModalCart(cart))
        .catch(err => {
            console.error("Error al obtener el carrito:", err);
            alert("Ocurrió un error al cargar los detalles del carrito.");
        });
}

function showModalCart(cart) {

    const modalContainer = document.getElementById('showModal');
    modalContainer.innerHTML = '';

    let productsHTML = '';
    cart.products.forEach(product => {
        productsHTML += `
            <div class="card mb-2">
              <div class="card-body d-flex align-items-center">
                <img src="${product.thumbnail}" alt="${product.title}" class="img-fluid me-3" style="max-width: 100px; max-height: 100px;">
                <div>
                  <h6 class="card-title">${product.title}</h6>
                  <p class="card-text mb-1">Precio: $${product.price}</p>
                  <p class="card-text mb-1">Cantidad: ${product.quantity}</p>
                  <p class="card-text">Total: $${product.total}</p>
                </div>
              </div>
            </div>
        `;
    });

    const modalCart = `
        <div class="modal fade" id="modalCart" tabindex="-1" aria-labelledby="modalCartLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalCartLabel">ID Carro: ${cart.id}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <h5>User ID: ${cart.userId}</h5>
                <p>Total Productos: ${cart.totalProducts}</p>
                <p>Total Cantidad: ${cart.totalQuantity}</p>
                <p>Total: $${cart.total.toFixed(2)}</p>
                <p>Descuento Total: $${cart.discountedTotal.toFixed(2)}</p>
                <hr/>
                ${productsHTML}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar.</button>
              </div>
            </div>
          </div>
        </div>
    `;

    modalContainer.innerHTML = modalCart;

    const modal = new bootstrap.Modal(document.getElementById('modalCart'));
    modal.show();
}
