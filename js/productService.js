function getProducts(){
    document.getElementById('cardHeader').innerHTML = '<h3>Lista de Productos</h3>'
    document.getElementById('info').innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Cargando...</span></div></div>'

    fetch('https://dummyjson.com/products', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((result) => {
        return result.json().then(
            data => {
                return {
                    status: result.status,
                    body: data
                }
            }
        )
    })
    .then((response) => {
        if(response.status == 200){
            let listProducts = `
                <table class="table table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Título</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Categoría</th>
                            <th scope="col">Marca</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
            `
            
            //devuelve los productos en response.body.products
            response.body.products.forEach(product => {
                listProducts = listProducts.concat(`
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.title}</td>
                        <td>$${product.price}</td>
                        <td>${product.category}</td>
                        <td>${product.brand || 'N/A'}</td>
                        <td>${product.stock}</td>
                        <td><img src="${product.thumbnail}" class="img-thumbnail" alt="Imagen del producto" style="width: 50px; height: 50px; object-fit: cover;"></td>
                        <td>
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="showInfoProduct(${product.id})">Ver</button>
                        </td>
                    </tr>
                `)
            })
            
            listProducts = listProducts.concat(`
                    </tbody>
                </table>
            `)
            
            document.getElementById('info').innerHTML = listProducts
        }
        else{
            document.getElementById('info').innerHTML = '<div class="alert alert-warning" role="alert"><h4>No se encontraron productos</h4></div>'
        }
    })
    .catch((error) => {
        console.error('Error:', error)
        document.getElementById('info').innerHTML = '<div class="alert alert-danger" role="alert"><h4>Error al cargar los productos</h4></div>'
    })
}

function showInfoProduct(productId){
    // Usamos la misma API de DummyJSON para obtener un producto específico
    fetch(`https://dummyjson.com/products/${productId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((result) => {
        return result.json().then(
            data => {
                return {
                    status: result.status,
                    body: data
                }
            }
        )
    })
    .then((response) => {
        if(response.status === 200){
            showModalProduct(response.body)
        }else{
            document.getElementById('info').innerHTML = '<div class="alert alert-danger" role="alert"><h4>No se encontró el producto.</h4></div>'
        }
    })
    .catch((error) => {
        console.error('Error:', error)
        document.getElementById('info').innerHTML = '<div class="alert alert-danger" role="alert"><h4>Error al cargar el producto</h4></div>'
    })
}

function showModalProduct(product){
    const modalProduct = `
        <div class="modal fade" id="modalProduct" tabindex="-1" aria-labelledby="modalProductLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="modalProductLabel">Detalles del Producto</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar."></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
                                    <div class="carousel-inner">
                                        ${product.images.map((image, index) => `
                                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                                <img src="${image}" class="d-block w-100" alt="Imagen del producto" style="height: 300px; object-fit: cover;">
                                            </div>
                                        `).join('')}
                                    </div>
                                    ${product.images.length > 1 ? `
                                        <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Anterior</span>
                                        </button>
                                        <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Siguiente</span>
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <h5 class="card-title">${product.title}</h5>
                                        <p class="card-text"><strong>Descripción:</strong> ${product.description}</p>
                                        <p class="card-text"><strong>Categoría:</strong> ${product.category}</p>
                                        <p class="card-text"><strong>Marca:</strong> ${product.brand || 'N/A'}</p>
                                        <p class="card-text"><strong>Precio:</strong> $${product.price}</p>
                                        <p class="card-text"><strong>Descuento:</strong> ${product.discountPercentage}%</p>
                                        <p class="card-text"><strong>Rating:</strong> 
                                            <span class="badge bg-warning text-dark">${product.rating} ⭐</span>
                                        </p>
                                        <p class="card-text"><strong>Stock:</strong> 
                                            <span class="badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}">${product.stock} unidades</span>
                                        </p>
                                        <p class="card-text"><strong>SKU:</strong> ${product.sku}</p>
                                        <p class="card-text"><strong>Peso:</strong> ${product.weight}g</p>
                                        <p class="card-text"><strong>Dimensiones:</strong> ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm</p>
                                        <p class="card-text"><strong>Garantía:</strong> ${product.warrantyInformation}</p>
                                        <p class="card-text"><strong>Envío:</strong> ${product.shippingInformation}</p>
                                        <p class="card-text"><strong>Política de devolución:</strong> ${product.returnPolicy}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ${product.reviews && product.reviews.length > 0 ? `
                            <div class="mt-4">
                                <h6>Reseñas:</h6>
                                ${product.reviews.map(review => `
                                    <div class="card mb-2">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-between">
                                                <strong>${review.reviewerName}</strong>
                                                <span class="badge bg-warning text-dark">${review.rating} ⭐</span>
                                            </div>
                                            <p class="card-text mt-2">${review.comment}</p>
                                            <small class="text-muted">${new Date(review.date).toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary">Agregar al Carrito</button>
                    </div>
                </div>
            </div>
        </div>
    `
    
    // Eliminar modal anterior si existe
    const existingModal = document.getElementById('modalProduct')
    if (existingModal) {
        existingModal.remove()
    }
    
    document.getElementById('showModal').innerHTML = modalProduct

    const modal = new bootstrap.Modal(document.getElementById('modalProduct'))
    modal.show()
}

// Función adicional para obtener productos por categoría
function getProductsByCategory(category) {
    document.getElementById('cardHeader').innerHTML = `<h3>Productos - ${category}</h3>`
    document.getElementById('info').innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Cargando...</span></div></div>'

    fetch(`https://dummyjson.com/products/category/${category}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((result) => {
        return result.json().then(
            data => {
                return {
                    status: result.status,
                    body: data
                }
            }
        )
    })
    .then((response) => {
        if(response.status == 200){
            let listProducts = `
                <table class="table table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Título</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Categoría</th>
                            <th scope="col">Marca</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
            `
            
            response.body.products.forEach(product => {
                listProducts = listProducts.concat(`
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.title}</td>
                        <td>$${product.price}</td>
                        <td>${product.category}</td>
                        <td>${product.brand || 'N/A'}</td>
                        <td>${product.stock}</td>
                        <td><img src="${product.thumbnail}" class="img-thumbnail" alt="Imagen del producto" style="width: 50px; height: 50px; object-fit: cover;"></td>
                        <td>
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="showInfoProduct(${product.id})">Ver</button>
                        </td>
                    </tr>
                `)
            })
            
            listProducts = listProducts.concat(`
                    </tbody>
                </table>
            `)
            
            document.getElementById('info').innerHTML = listProducts
        }
        else{
            document.getElementById('info').innerHTML = '<div class="alert alert-warning" role="alert"><h4>No se encontraron productos en esta categoría</h4></div>'
        }
    })
    .catch((error) => {
        console.error('Error:', error)
        document.getElementById('info').innerHTML = '<div class="alert alert-danger" role="alert"><h4>Error al cargar los productos</h4></div>'
    })
}

// Función para obtener todas las categorías
function getCategories() {
    fetch('https://dummyjson.com/products/categories', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(categories => {
        console.log('Categorías disponibles:', categories)
        // Aquí usa las categorías para crear un menú de navegación
        return categories
    })
    .catch((error) => {
        console.error('Error al cargar categorías:', error)
    })
}

// Función para buscar productos
function searchProducts(query) {
    document.getElementById('cardHeader').innerHTML = `<h3>Resultados de búsqueda: "${query}"</h3>`
    document.getElementById('info').innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Buscando...</span></div></div>'

    fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((result) => {
        return result.json().then(
            data => {
                return {
                    status: result.status,
                    body: data
                }
            }
        )
    })
    .then((response) => {
        if(response.status == 200 && response.body.products.length > 0){
            let listProducts = `
                <table class="table table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Título</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Categoría</th>
                            <th scope="col">Marca</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
            `
            
            response.body.products.forEach(product => {
                listProducts = listProducts.concat(`
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.title}</td>
                        <td>$${product.price}</td>
                        <td>${product.category}</td>
                        <td>${product.brand || 'N/A'}</td>
                        <td>${product.stock}</td>
                        <td><img src="${product.thumbnail}" class="img-thumbnail" alt="Imagen del producto" style="width: 50px; height: 50px; object-fit: cover;"></td>
                        <td>
                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="showInfoProduct(${product.id})">Ver</button>
                        </td>
                    </tr>
                `)
            })
            
            listProducts = listProducts.concat(`
                    </tbody>
                </table>
            `)
            
            document.getElementById('info').innerHTML = listProducts
        }
        else{
            document.getElementById('info').innerHTML = '<div class="alert alert-info" role="alert"><h4>No se encontraron productos que coincidan con tu búsqueda</h4></div>'
        }
    })
    .catch((error) => {
        console.error('Error:', error)
        document.getElementById('info').innerHTML = '<div class="alert alert-danger" role="alert"><h4>Error al realizar la búsqueda</h4></div>'
    })
}