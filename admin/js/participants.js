(async () => {
    const urlBase = "http://localhost:3000"
    const tblParticipants = document.getElementById("tblParticipants")
    let strHtml = `
    <thead>
    <tr><th class="w-100 text-center bg-warning" colspan="4">
    Lista de Participantes</th>
    </tr>
    <tr class="bg-info">
    <th class="w-2">#</th>
    <th class="w-50">Nome</th>
    <th class="w-38">E-mail</th>
    <th class="w-10">Ações</th>
    </tr>
    </thead><tbody>`
    const response = await fetch(`${urlBase}/participants`)
    const participants = await response.json()
    let i = 1
    for (const participant of participants) {
        strHtml += `
        <tr>
        <td>${i}</td>
        <td>${participant.nameParticipant}</td>
        <td>${participant.id}</td>
        <td><i id="${participant.id}" class="fas fa-trash-alt remove"></i>
        </td>
        </tr>
        `
        i++
    }
    strHtml += `</tbody>`
    tblParticipants.innerHTML = strHtml
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
                    const participantId = btnDelete[i].getAttribute("id")
                    try {
                        const response = await fetch(`${urlBase}/participants/${participantId}`, {
                            method: "DELETE"
                        })
                        swal.fire({
                            icon: (response.ok) ? "success" : "error",
                            title: "Remoção da inscrição",
                            showConfirmButton: true,
                            text: (response.ok) ? "Removida com sucesso!" : response.statusText,
                        })
                    } catch (err) {
                        swal.fire({
                            icon: "error",
                            title: "Remoção da inscrição",
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