document.getElementById("formLogin").addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    login(email, password)
})

function login(email, password){
    let message = ''
    let alertType = ''
    localStorage.removeItem('token')
    fetch("https://reqres.in/api/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'x-api-key': 'reqres-free-v1'
        },
        body: JSON.stringify({ email, password })
    })
    .then((response) =>{
        if(response.status === 200){
            alertType = 'success'
            message = 'Inicio de sesión exitoso';
            console.log('responde bien'+ response)
            alertBuilder(alertType, message)
            response.json().then((data) => {
                localStorage.setItem('token', data.token)
            })            
            setTimeout(() => {
                location.href = 'admin/dashboard.html'
            }, 2000) // 2000 ms = 2 segundos
        }
        else{
            alertType = 'danger'
            message = 'Correo o contraseña incorrectos.';
            alertBuilder(alertType, message)
        }        
    })
    .catch((error) => {
        alertType = 'danger'
        message = 'Error inesperado.';
        console.error(error)
        alertBuilder(alertType, message)
    })
}

function alertBuilder(alertType, message){
    const alert = `
        <div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.getElementById('alert').innerHTML = alert;
}