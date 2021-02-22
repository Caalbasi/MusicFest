(async () => {      //Musicians list
  const renderMusicians = document.getElementById("renderMusicians")
  let txtMusicians = ""
  const responseMusicians = await fetch("http://localhost:3000/musicians")
  const musicians = await responseMusicians.json()

  for (const musician of musicians) {
    txtMusicians = fillMusicians(txtMusicians, musician)    
  }
  renderMusicians.innerHTML = txtMusicians

  const btnView = document.getElementsByClassName("viewMusician")  //apresenta janela modal do artista
    for (let i = 0; i < btnView.length; i++) {
      btnView[i].addEventListener("click", () => {
        for (const musician of musicians) {
          if (musician.id == btnView[i].getAttribute("id")) {
            swal.fire({
              title: musician.name,
              text: musician.bio,
              imageUrl: musician.photo,
              imageWidth: 400,
              imageHeight:400,
              imageAlt: 'Foto do orador',
              animation: false
            })
          }
        }
      })
    }

  const renderSponsors = document.getElementById("renderSponsors")    //Sponsors list
  let txtSponsors = ""
  const responseSponsors = await fetch("http://localhost:3000/sponsors")
  const sponsors = await responseSponsors.json()

  for (const sponsor of sponsors) {
    txtSponsors += `
  <div class="col-md-3 col-sm-6 text-center">                    
    <a href="${sponsor.link}" target="_blank">
      <img class="img-fluid d-block mx-auto mb-4" 
        src="${sponsor.logo}" width="125" height="125"
        alt="${sponsor.name}">
    </a>
  </div>`
  }   
  renderSponsors.innerHTML = txtSponsors
})()

window.onload = function () {  //faz post da inscricao e verifica se o email está repetido!
  const btnRegister = document.getElementById("btnRegister")
  btnRegister.addEventListener("click", function () {
    Swal.fire({
      title: "Inscrição no Festival",
      html:
        '<input id="txtName" class="swal2-input" placeholder="nome">',        
      showCancelButton: true,
      input:"email",
      inputPlaceholder: "e-mail",
      confirmButtonText: "Inscrever",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        const nameParticipant = document.getElementById("txtName").value        
        const urlBase = `http://localhost:3000/participants/${email}`
        return fetch(`${urlBase}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          //response not ok - email doesnt exist
          const urlBase = "http://localhost:3000/participants"
          return fetch(`${urlBase}`, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST",
            body: `nameParticipant=${nameParticipant}&id=${email}`
          })
          .then(result => {
            if (result.ok) {
                swal.fire({
                  title: "Inscrição feita com sucesso!",
                  icon: "success"
                })
            }
          })
          .catch(error => {
            swal.fire({
              title: `Pedido falhou: ${error.message}`,
              icon: "error"
            });
          });
        })
        .then(emailExists => {
          if (emailExists.id === email) {
            swal.fire({
              title: `Endereço email já registado: ${email}`,
              icon: "warning"
              });
          }
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    })
  })
}

const btnLogin=document.getElementById("btnLogin")    //area privada
btnLogin.addEventListener("click", (e) => {
  // e.preventDefault();
  Swal.fire({
    title: "Autenticação",
    html:
    '<input id="txtEmail" class="swal2-input" placeholder="e-mail">' +
    '<input id="txtPassword" type="password" class="swal2-input" placeholder="password">',
    showCancelButton: true,
    confirmButtonText: "Entrar",
    cancelButtonText: "Cancelar",
    showLoaderOnConfirm: true,
    preConfirm: () => {
      const email=document.getElementById("txtEmail").value 
      const password=document.getElementById("txtPassword").value      
      const urlBase= `http://localhost:3000/signin/${email}`
      return fetch(`${urlBase}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then (result => {
          if (result.id === email) {
            swal.fire({title: "Autenticação feita com sucesso!"})
            sessionStorage.token = email
            location.href="http://127.0.0.1:5501/admin/html/participants.html"
          } else {
            swal.fire({title:"Não foi possível fazer autenticação"})
          }   
        })
        .catch(error => {
          swal.fire(`Autenticação falhou: ${error.message}`);
        });
    },
    allowOutsideClick: () => !swal.isLoading()
  })
})

/*
const contactForm=document.getElementById("contactForm")    //envia a mensagem mas o Alert é muito rápido
contactForm.addEventListener("submit", async() => {
  const name=document.getElementById("name").value
  const email=document.getElementById("email").value
  const phoneNumber=document.getElementById("phoneNumber").value
  const message=document.getElementById("message").value
  const responseContacts= await fetch("http://localhost:3000/contacts", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    body: `email=${email}&name=${name}&phoneNumber=${phoneNumber}&subject=${message}`
  })
  const result = await responseContacts.json()
    
  if(result) {
    swal.fire({
      text:"Envio de mensagem",
      icon: "success"})
  } else{
  }
})
*/

const sendMessageButton=document.getElementById("contactForm")
sendMessageButton.addEventListener("submit", function (e) {
  e.preventDefault();
  Swal.fire({
    text:"Envio de mensagem",
    icon: "success",
    showLoaderOnConfirm: true,
    preConfirm: () => {              
      const name=document.getElementById("name").value
      const email=document.getElementById("email").value
      const phoneNumber=document.getElementById("phoneNumber").value
      const message=document.getElementById("message").value
      return fetch("http://localhost:3000/contacts", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: `email=${email}&name=${name}&phoneNumber=${phoneNumber}&subject=${message}`
      })
      .then(response => {
        if(!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      }) 
      // .then(result => {
      //   if (result){
      //     if(result.value.err_code) {
      //       swal.fire({title: `${result.value.err_code}`})
      //     }
      //   }
      // })     
      .catch(error => {
        swal.fire(`O envio falhou: ${error.message}`);
      });
    },
    allowOutsideClick: () => !swal.isLoading()
    
  })
  
})

function fillMusicians(txtMusicians, musician) {
  txtMusicians += `
  <div class="col-md-6 col-lg-4 text-center">                    
    <div class="team-member">
      <img id="${musician.id}" class="mx-auto rounded-circle viewMusician" src="${musician.photo}" width="255" height="255"
        alt="Foto Artista">
      <h4>${musician.name}</h4>      
      <ul class="list-inline social-buttons">`
      // <p class="text-muted">${musician.bio}</p>

  if (musician.twitter !== null) { //se não tiver alguma das redes sociais
    txtMusicians += `
        <li class="list-inline-item">
          <a href="${musician.twitter}" target="_blank">
            <i class="fab fa-twitter"></i></a>
        </li>`
  }
  if (musician.facebook !== null) {
    txtMusicians += `
        <li class="list-inline-item">
          <a href="${musician.facebook}" target="_blank">
            <i class="fab fa-facebook-f"></i></a>
        </li>`
  }
  if (musician.linkedin !== null) {
    txtMusicians += `
        <li class="list-inline-item">
          <a href="${musician.linkedin}" target="_blank">
            <i class="fab fa-linkedin-in"></i></a>
        </li>`
  }
  txtMusicians += `
      </ul>
  </div>
</div>
`
  return txtMusicians
}

