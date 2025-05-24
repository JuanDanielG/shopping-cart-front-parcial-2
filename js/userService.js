function users(page = ''){
    document.getElementById('cardHeader').innerHTML = '<h5>Listado de usuarios</h5>'
    document.getElementById('info').innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Cargando...</span></div></div>'
    
    const REQRES_ENDPOINT = page ? `https://dummyjson.com/users?page=${page}` : 'https://dummyjson.com/users'
    
    fetch(REQRES_ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then((response) =>{
        return response.json().then(
            data => {
                return {
                    status: response.status,
                    info: data
                }
            }
        )
    })
    .then((result) => {
        if(result.status === 200){
            let listUsers = `
                <table class="table table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
            `
            
            result.info.users.forEach(user => {
                listUsers = listUsers + `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName} ${user.lastName}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td><img src="${user.image}" class="img-thumbnail" alt="avatar del usuario" style="width: 50px; height: 50px; object-fit: cover;"></td>
                        <td>
                            <button type="button" class="btn btn-outline-info btn-sm" onclick="getUser('${user.id}')">Ver info</button>
                        </td>
                    </tr>
                `  
            });
            
            listUsers = listUsers + `
                    </tbody>
                </table>
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item ${result.info.skip === 0 ? 'disabled' : ''}">
                            <a class="page-link" href="#" onclick="users('${Math.max(1, (result.info.skip / result.info.limit))}')">Anterior</a>
                        </li>
                        <li class="page-item active">
                            <span class="page-link">Página ${Math.floor(result.info.skip / result.info.limit) + 1}</span>
                        </li>
                        <li class="page-item ${result.info.skip + result.info.limit >= result.info.total ? 'disabled' : ''}">
                            <a class="page-link" href="#" onclick="users('${Math.floor(result.info.skip / result.info.limit) + 2}')">Siguiente</a>
                        </li>
                    </ul>
                </nav>
            `
            document.getElementById('info').innerHTML = listUsers
        }
        else{
            document.getElementById('info').innerHTML = '<div class="alert alert-warning" role="alert"><h4>No existen usuarios en la BD.</h4></div>'
        }
    })
    .catch((error) => {
        console.error('Error:', error)
        document.getElementById('info').innerHTML = '<div class="alert alert-danger" role="alert"><h4>Error al cargar los usuarios</h4></div>'
    })
}

function getUser(idUser){
    const REQRES_ENDPOINT = `https://dummyjson.com/users/${idUser}`
    
    fetch(REQRES_ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then((response) =>{
        return response.json().then(
            data => {
                return {
                    status: response.status,
                    info: data
                }
            }
        )
    })
    .then((result) =>{
        if(result.status === 200){
            const user = result.info
            showModalUser(user)
        }
        else{
            document.getElementById('info').innerHTML = 
                '<div class="alert alert-danger" role="alert"><h4>No se encontró el usuario en la API.</h4></div>'
        }
    })
    .catch((error) => {
        console.error('Error:', error)
        document.getElementById('info').innerHTML = '<div class="alert alert-danger" role="alert"><h4>Error al cargar el usuario</h4></div>'
    })
}

function showModalUser(user){
    const modalUser = `
    <!-- Modal -->
    <div class="modal fade" id="showModalUser" tabindex="-1" aria-labelledby="modalUserLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modalUserLabel">Información del Usuario</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <div class="row">
                <div class="col-md-4">
                    <img src="${user.image}" class="img-fluid rounded" alt="Avatar del usuario">
                </div>
                <div class="col-md-8">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${user.firstName} ${user.lastName}</h5>
                            <p class="card-text"><strong>Nombre de usuario:</strong> ${user.username}</p>
                            <p class="card-text"><strong>Email:</strong> ${user.email}</p>
                            <p class="card-text"><strong>Teléfono:</strong> ${user.phone}</p>
                            <p class="card-text"><strong>Fecha de nacimiento:</strong> ${user.birthDate}</p>
                            <p class="card-text"><strong>Género:</strong> ${user.gender}</p>
                            <p class="card-text"><strong>Universidad:</strong> ${user.university}</p>
                            <p class="card-text"><strong>Dirección:</strong> ${user.address.address}, ${user.address.city}, ${user.address.state}</p>
                            <p class="card-text"><strong>Empresa:</strong> ${user.company.name} - ${user.company.title}</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
    `

    const existingModal = document.getElementById('showModalUser')
    if (existingModal) {
        existingModal.remove()
    }
    
    document.getElementById('showModal').innerHTML = modalUser
    const modal = new bootstrap.Modal(document.getElementById('showModalUser'))
    modal.show()
}