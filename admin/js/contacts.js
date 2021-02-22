(async () => {
    const urlBase = "http://localhost:3000"
    const tblContacts = document.getElementById("tblContacts")
    let strHtml = `
    <thead>
    <tr><th class="w-100 text-center bg-warning" colspan="5">
    Lista de Mensagens</th>
    </tr>
    <tr class="bg-info">
    <th class="w-2">#</th>    
    <th class="w-20">Nome</th>    
    <th class="w-20">E-mail</th>
    <th class="w-48">Mensagem</th>
    <th class="w-10">Ações</th>
    </tr>
    </thead><tbody>`
    const response = await fetch(`${urlBase}/contacts`)
    const contacts = await response.json()
    let i = 1
    for (const contact of contacts) {
        strHtml += `
        <tr>
        <td>${i}</td>
        <td>${contact.name}</td>
        <td>${contact.email}</td>
        <td>${contact.subject}</td>
        <td><i id="${contact.id}" class="fas fa-trash-alt remove"></i>
        </td>
        </tr>
        `
        i++
    }
    strHtml += `</tbody>`
    tblContacts.innerHTML = strHtml
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
                if (result.value) {
                    const contactId = btnDelete[i].getAttribute("id")
                    try {
                        const response = await fetch(`${urlBase}/contacts/${contactId}`, {
                            method: "DELETE"
                        })
                        swal.fire({
                            icon: (response.ok) ? "success" : "error",
                            title: "Remoção da mensagem",
                            showConfirmButton: true,
                            text: (response.ok) ? "Removida com sucesso!" : response.statusText,
                        })
                    } catch (err) {
                        swal.fire({
                            icon: "error",
                            title: "Remoção da mensagem",
                            text: err.message
                        })
                    }
                }
            })
        })
    }
})()

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