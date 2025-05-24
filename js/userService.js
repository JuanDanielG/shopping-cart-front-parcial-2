function users(page) {
    document.getElementById('cardHeader').innerHTML =
        "<h5>Listado de usuarios</h5>";
    const REQRES_ENDPOINT = 'https://reqres.in/api/users?page=' + page
    fetch(REQRES_ENDPOINT, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "x-api-key": "reqres-free-v1",
        },
    })
        .then((response) => {
            return response.json().then((data) => {
                return {
                    status: response.status,
                    info: data,
                };
            });
        })
        .then((result) => {
            if (result.status === 200) {
                let listUsers = `
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido</th>
                        <th scope="col">Avatar</th>
                        <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
                result.info.data.forEach((user) => {
                    listUsers =
                        listUsers +
                        `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.first_name}</td>
                        <td>${user.last_name}</td>
                        <td><img src="${user.avatar}" class="img-thumbnail" alt="avatar del usuario"></td>
                        <td><button type="button" class="btn btn-outline-info" onclick="getUser('${user.id}')" >Ver info</button></td>
                    </tr>
                `;
                });
                listUsers =
                    listUsers +
                    `
                </tbody>
            </table>
            <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="usersPage1" onclick="users('1')">1</a></li>
    <li class="page-item"><a class="page-link" href="usersPage2" onclick="users('2')">2</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>
            `;
                document.getElementById("info").innerHTML = listUsers;
            } else {
                document.getElementById("info").innerHTML =
                    "No existen usuarios en la BD";
            }
        });
}

function getUser(idUser){
    const REQRES_ENDPOINT = 'https://reqres.in/api/users?page=' + idUser
    fetch(REQRES_ENDPOINT, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "x-api-key": "reqres-free-v1",
        },
    })
        .then((response) => {
            return response.json().then((data) => {
                return {
                    status: response.status,
                    info: data,
                };
            });
        })

.then((result) => {
    if(result.status === 200){
        const user = result.info.data
        showModalUser(user)
    }
    else{
        document.getElementById('info').innerHTML=
        '<h3>No se encontró el usuario en la api</h3>'
        }
    })
}

function showModalUser (user){
    const modalUser = `
    <!-- Modal -->
    <div class="modal fade" id="showModalUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog-sm">
        <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Ver usuario</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div class="card">
      <img src="${user.avatar}" class="card-img-top" alt="Avatar del usuario">
      <div class="card-body">
        <h5 class="card-title">Información del usuario </h5>
        <p class="card-text">Correo: ${user.email}</p>
        <p class="card-text">Nombre: ${user.first_name}</p>
        <p class="card-text">Apellido: ${user.last_name}</p>
      </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
    `
    document.getElementById('modalUser').innerHTML = modalUser
    const modal = new bootstrap.Modal(document.getElementById('showModalUser'))
    modal.show()
}