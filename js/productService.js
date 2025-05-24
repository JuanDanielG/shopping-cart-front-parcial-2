async function getProducts() {
    document.getElementById('cardHeader').innerHTML = '<h3>Lista de Productos</h3>';
    document.getElementById('info').innerHTML = '<p>Cargando productos...</p>';

    try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();

        if (data.products?.length > 0) {
            let listProducts = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Título</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Marca</th>
                            <th>Imagen</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.products.forEach(product => {
                listProducts += `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.title}</td>
                        <td>$${product.price}</td>
                        <td>${product.category}</td>
                        <td>${product.brand}</td>
                        <td><img src="${product.thumbnail}" class="img-thumbnail" style="max-width: 60px;" alt="Producto"></td>
                        <td>
                            <button class="btn btn-outline-primary btn-sm" onclick="showInfoProduct(${product.id})">Ver</button>
                        </td>
                    </tr>
                `;
            });

            listProducts += `</tbody></table>`;
            document.getElementById('info').innerHTML = listProducts;
        } else {
            document.getElementById('info').innerHTML = '<h3>No se encontraron productos.</h3>';
        }

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('info').innerHTML = '<h3>Error al cargar los productos.</h3>';
    }
}

async function showInfoProduct(productId) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await response.json();
        showModalProduct(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        alert("No se pudo cargar la información del producto.");
    }
}

function showModalProduct(product) {
    const reviews = product.reviews?.map(review => `
        <div class="border rounded p-2 mb-2">
            <strong>${review.reviewerName}</strong> (${review.rating}/5)<br>
            <small>${new Date(review.date).toLocaleDateString()}</small><br>
            <p>${review.comment}</p>
        </div>
    `).join('') || "<p>Sin reseñas disponibles.</p>";

    const modalHTML = `
        <div class="modal fade" id="modalProduct" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${product.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${product.thumbnail}" class="img-fluid rounded" alt="${product.title}">
                                <p><strong>Stock:</strong> ${product.stock}</p>
                                <p><strong>Rating:</strong> ${product.rating}</p>
                                <p><strong>Precio:</strong> $${product.price}</p>
                            </div>
                            <div class="col-md-8">
                                <p><strong>Descripción:</strong> ${product.description}</p>
                                <p><strong>Categoría:</strong> ${product.category}</p>
                                <p><strong>Marca:</strong> ${product.brand}</p>
                                <p><strong>SKU:</strong> ${product.sku}</p>
                                <p><strong>Política de Devolución:</strong> ${product.returnPolicy}</p>
                                <hr>
                                <h6>Reseñas:</h6>
                                ${reviews}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('showModal').innerHTML = modalHTML;

    setTimeout(() => {
        const modal = new bootstrap.Modal(document.getElementById('modalProduct'));
        modal.show();
    }, 100);
}
