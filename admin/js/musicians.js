(async () => {              //carrega a tabela de artistas 
    const urlBase = "http://localhost:3000"
    const tblMusicians = document.getElementById("tblMusicians")
    let strHtml = `
    <thead>
    <tr><th class="w-100 text-center bg-warning" colspan="4">
    Lista de Artistas</th>
    </tr>
    <tr class="bg-info">
    <th class="w-2">#</th>
    <th class="w-50">Nome</th>
    <th class="w-38">Localização</th>
    <th class="w-10">Ações</th>
    </tr>
    </thead><tbody>`
    const response = await fetch(`${urlBase}/musicians`)
    const musicians = await response.json()
    let i = 1
    for (const musician of musicians) {
        strHtml += `
        <tr>
            <td>${i}</td>
            <td>${musician.name}</td>
            <td>${musician.location}</td>
            <td>
                <a id="${musician.id}" class="fas fa-edit edit" href="#"></a>
                <i id="${musician.id}" class="fas fa-trash-alt remove"></i>
            </td>
        </tr>
    `
        i++
    }
    strHtml += `</tbody>`
    tblMusicians.innerHTML = strHtml

    const btnEdit = document.getElementsByClassName("edit")   //Alterar artista: qnd carrego edit,vai buscar a info desse id e poe no formulario
    for (let i = 0; i < btnEdit.length; i++) {
        btnEdit[i].addEventListener("click", () => {            
            for (const musician of musicians) {
                if (musician.id == btnEdit[i].getAttribute("id")) {
                    document.getElementById("txtId").value = musician.id
                    document.getElementById("txtName").value = musician.name
                    document.getElementById("txtLocation").value = musician.location
                    document.getElementById("locationLat").value = musician.locationLat
                    document.getElementById("locationLng").value = musician.locationLng
                    document.getElementById("txtPhoto").value = musician.photo
                    document.getElementById("txtFacebook").value = musician.facebook
                    document.getElementById("txtTwitter").value = musician.twitter
                    document.getElementById("txtLinkedin").value = musician.linkedin
                    document.getElementById("txtBio").value = musician.bio
                }
            }
        })
    }


const btnDelete = document.getElementsByClassName("remove")
for (let i = 0; i < btnDelete.length; i++) {
    btnDelete[i].addEventListener("click", () => {
        swal.fire({
            title: "Tem a certeza?",
            text: "Não será possível inverter a remoção!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonText: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Remover"
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                const musicianId = btnDelete[i].getAttribute("id")
                try {
                    const response = await fetch(`${urlBase}/musicians/${musicianId}`, {
                        method: "DELETE"
                    })
                    swal.fire({
                        icon: (response.ok) ? "success" : "error",
                        title: "Remoção de artista",
                        showConfirmButton: true,
                        text: (response.ok) ? "Removido com sucesso!" : response.statusText,
                    })
                } catch (err) {
                    swal.fire({
                        icon: "error",
                        title: "Remoção de artista",
                        text: err.message
                    })
                }
            }
        })
        .catch(err => {
            swal.fire({
                icon: "error",
                title: "Erro na remoção de artista",
                showConfirmButton: true,
                text: err.message,
                timer: 3000
            })
        })
    })
}
})()

const frmMusician = document.getElementById("frmMusician")
frmMusician.addEventListener("submit", async (event) => {
    event.preventDefault()
    let isNew = document.getElementById("txtId").value === "";
    if (isNew) {
        return await fetch("http://localhost:3000/musicians", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: `name=${txtName.value}&location=${txtLocation.value}&locationLat=${locationLat.value}&locationLng=${locationLng.value}&photo=${txtPhoto.value}&facebook=${txtFacebook.value}&twitter=${txtTwitter.value}&linkedin=${txtLinkedin.value}&bio=${txtBio.value}`
        })
        .then(newMusician => {
            if (newMusician.ok) {
                swal.fire({
                    title: "Inserção feita com sucesso!",
                    icon: "success"
                })
            }
        })
    }
    else {
        return await fetch("http://localhost:3000/musicians/" + `${txtId.value}`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "PUT",
            body: `name=${txtName.value}&location=${txtLocation.value}&locationLat=${locationLat.value}&locationLng=${locationLng.value}&photo=${txtPhoto.value}&facebook=${txtFacebook.value}&twitter=${txtTwitter.value}&linkedin=${txtLinkedin.value}&bio=${txtBio.value}`
        })
        .then(existingMusician => {
            if (existingMusician.ok) {
                swal.fire({
                    title: "Alteração feita com sucesso!",
                    icon: "success"
                })
            }
        })
    }
})

window.onload = function () {
    if(!sessionStorage.token){
        location.href="http://127.0.0.1:5501"
    }
}

const btnLogout=document.getElementById("btnLogout")    //LogOut
btnLogout.addEventListener("click", (e) => {
  e.preventDefault();
  Swal.fire({
    title: "Sair da página Admin?",    
    showCancelButton: true,
    confirmButtonText: "Sair",
    cancelButtonText: "Cancelar",
    showLoaderOnConfirm: true,    
    allowOutsideClick: () => !swal.isLoading()
  }).then(result =>{
    if (result.isConfirmed){
      
        sessionStorage.removeItem("token")
        location.href="http://127.0.0.1:5501" 
    }
  })
})