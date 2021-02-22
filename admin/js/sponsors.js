(async () => {              //carrega a tabela de patrocinios 
    const urlBase = "http://localhost:3000"
    const tblSponsors = document.getElementById("tblSponsors")
    let strHtml = `
    <thead>
    <tr><th class="w-100 text-center bg-warning" colspan="4">
    Lista de Patrocinadores</th>
    </tr>
    <tr class="bg-info">
    <th class="w-2">#</th>
    <th class="w-50">Nome</th>
    <th class="w-38">Categoria</th>
    <th class="w-10">Ações</th>
    </tr>
    </thead><tbody>`
    const response = await fetch(`${urlBase}/sponsors`)
    const sponsors = await response.json()
    let i = 1
    for (const sponsor of sponsors) {
        strHtml += `
        <tr>
            <td>${i}</td>
            <td>${sponsor.name}</td>
            <td>${sponsor.category}</td>
            <td>
                <a id="${sponsor.id}" class="fas fa-edit edit" href="#"></a>
                <i id="${sponsor.id}" class="fas fa-trash-alt remove"></i>
            </td>
        </tr>
    `
        i++
    }
    strHtml += `</tbody>`
    tblSponsors.innerHTML = strHtml

    const btnEdit = document.getElementsByClassName("edit")   //Alterar patrocinador: qnd carrego edit,vai buscar a info desse id e poe no formulario
    for (let i = 0; i < btnEdit.length; i++) {
        btnEdit[i].addEventListener("click", () => {
            // isNew=false
            for (const sponsor of sponsors) {
                if (sponsor.id == btnEdit[i].getAttribute("id")) {
                    document.getElementById("txtId").value = sponsor.id
                    document.getElementById("txtName").value = sponsor.name
                    document.getElementById("txtCategory").value = sponsor.category                    
                    document.getElementById("txtLogo").value = sponsor.logo
                    document.getElementById("txtLink").value = sponsor.link 
                }
            }
        })
    }

    const btnDelete = document.getElementsByClassName("remove") //apagar patrocinador 
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
                    const sponsorId = btnDelete[i].getAttribute("id")
                    try {
                        const response = await fetch(`${urlBase}/sponsors/${sponsorId}`, {
                            method: "DELETE"
                        })
                        swal.fire({
                            icon: (response.ok) ? "success" : "error",
                            title: "Remoção de patrocinador",
                            showConfirmButton: true,
                            text: (response.ok) ? "Removido com sucesso!" : response.statusText,
                        })                                        
                    } catch (err) {
                        swal.fire({
                            icon: "error",
                            title: "Remoção de patrocinador",
                            text: err.message
                        })
                    }
                }
            })
        })
    }
})()

const frmSponsor = document.getElementById("frmSponsor")
frmSponsor.addEventListener("submit", async (event) => {
    event.preventDefault()
    let isNew = document.getElementById("txtId").value === "";
    if (isNew) {
        return await fetch("http://localhost:3000/sponsors", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: `name=${txtName.value}&category=${txtCategory.value}&logo=${txtLogo.value}&link=${txtLink.value}`
        })
        .then(newSponsor => {
            if (newSponsor.ok) {
                swal.fire({
                    title: "Inserção feita com sucesso!",
                    icon: "success"
                })
            }
        })
    }
    else {
        return await fetch("http://localhost:3000/sponsors/" + `${txtId.value}`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "PUT",
            body: `name=${txtName.value}&category=${txtCategory.value}&logo=${txtLogo.value}&link=${txtLink.value}`
        })
        .then(existingSponsor => {
            if (existingSponsor.ok) {
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