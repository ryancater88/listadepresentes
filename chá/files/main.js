  const apiUrl = 'https://script.google.com/macros/s/AKfycbzHS54qQceANe-kMfw4wY6wrKjOqdIRzQufU1KZaOa2KF76XNpVhPZCi5UZesWArDQV-w/exec?local=3';
  const endPointBuscar = apiUrl + '&path=buscar';
  const endPointReservar = apiUrl + '&path=reserva';

//-----------------------------------------------------------------------------//

 
  
  async function carregarPagina() {
    
    loading('exibir');
    const requestPresentes = await buscarPresentes();
    if(requestPresentes.Status == 400){return};

    gerarLista(requestPresentes.Dados)
  }

  //-----------------------------------------------------------------------------//

async function buscarPresentes(){

  const configuracaoRequest ={ method:'POST'} 

  const response = await fetch(endPointBuscar, configuracaoRequest);
  const data = await response.json();

  if (data.Status == 400) {
    return null;
  }
  else if (data.Status == 200) {
    return data;
  }
  else {
    return null;
  }

};

//-----------------------------------------------------------------------------//
function gerarLista(responseData){
  const listaInserir = document.getElementById('giftlist')

  responseData.forEach(element => {
    const idPresente = element.IdPresente;
    const nomePresente = element.NomePresente;
    const linkPresente = element.LinkPresente;
    const imagemPresente = element.ImagemPresente;

    listaInserir.innerHTML +=`
        <div id="${idPresente}" class="gift-item">

        <div class="image-box">
            <img class="gift-image" src="${imagemPresente}">
        </div>
        
        <div class="info-box">
            <title class="gift-title">${nomePresente}</title>
            <a class="gift-link" target="_blank" href="${linkPresente}">Sugestão de Compra</a>
        </div>
        <div class="button-box">
            <button class="gift-button confirm" id="escolherButton" onclick=modalReserva(${idPresente})>Escolher presente</button>
        </div>
    </div>
  `
  });
  loading('ocultar')
}

 //-----------------------------------------------------------------------------//

async function sendEscolhaPresente() {
  
  const idPresente = document.querySelector('#enviarReserva').getAttribute('idenviar');
  const nome = document.querySelector('#convidadoNome').value;
  const email = document.querySelector('#convidadoEmail').value;
  const emailValido = validarEmail(email);
   loading('exibir');

  if(emailValido == false){
    msgInvalido('convidadoEmail', 'exibir');
    loading('ocultar');
    return
  }
  else{
    msgInvalido('convidadoEmail', 'ocultar')
  }

  if(!nome){
    msgInvalido('convidadoNome', 'exibir');
    loading('ocultar');
    return
  }
  else{
    msgInvalido('convidadoNome', 'ocultar');
  }

    data = {
      'Id' : idPresente,
      'Convidado'  : nome,
      'Email' : email
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(data),
  };

  const requisicao = await fetch(endPointReservar, options);
  const dadosResponse = await requisicao.json();

  if(dadosResponse.Status == 400){
    loading('ocultar');
    mostrarAlerta(dadosResponse.Mensagem, 400)
  }
  else if(dadosResponse.Status == 200){
    loading('ocultar');
    mostrarAlerta(dadosResponse.Mensagem, 200)
    modalReserva(null, 'ocultar')
    carregarPagina()
  }
  else{
    loading('ocultar');
    mostrarAlerta('Nenhuma resposta recebida do servidor :(', 400)  
  }
}

//-----------------------------------------------------------------------------//

function validarEmail(email) {
  let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return regex.test(email)
};

//-----------------------------------------------------------------------------//


function msgInvalido(idCampo, acao) {
  
  var campo = document.getElementById(idCampo);
  var infoLabelCampo = document.querySelector(`#${idCampo}`).parentNode.childNodes[1].textContent;
  var mensagem = `Campo ${infoLabelCampo} inválido`;

    if (acao == 'exibir'){
      campo.classList.add('inputInvalido');
      $(`#${idCampo}`).tooltip({title: mensagem, trigger: "manual"}).tooltip('show');

    }
    else{
      campo.classList.remove('inputInvalido')
      $(`#${idCampo}`).tooltip('hide');
    }

   }

  //-----------------------------------------------------------------------------//
function modalReserva(idPresente, action){
  if(!action){
    var meuModal = new bootstrap.Modal(document.getElementById('modalReservar'), {
      backdrop: 'static',
      keyboard: false
    });
  
    var modalButton = document.getElementById('enviarReserva')
      
    modalButton.setAttribute('idEnviar', idPresente);
    meuModal.show();
  }
  else{
    const buttonClose = document.querySelector('.btn-close');
    const event = new Event('click')
    const nome = document.querySelector('#convidadoNome');
    const email = document.querySelector('#convidadoEmail');

    nome.value = '';
    email.value = '';
    buttonClose.dispatchEvent(event);


  }
  
}
  //-----------------------------------------------------------------------------//
  function mostrarAlerta(mensagem, status){
    const body = document.querySelector('#group-alert');
    let min = 1;
    let max = 10;
    let radomKey = Math.floor(Math.random() * (max - min + 1)) + min;

    switch(status){
      case 200 :{
        body.innerHTML += `<div id=${radomKey} class="alert alert-success d-flex align-items-center fadeIn" role="alert" style=" width: 230px;
        position: fixed;
        bottom: 0;
        right: 4px;
        z-index: 2;">
          <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"></use></svg>
          <div>
            ${mensagem}
          </div>
        </div>`
        break
      };
      case 400 : {
        body.innerHTML += `<div id=${radomKey} class="alert alert-danger d-flex align-items-center fadeIn" role="alert" style=" width: 230px;
        position: fixed;
        bottom: 0;
        right: 4px;
        z-index: 2;" hidden>
          <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"></use></svg>
          <div>
          ${mensagem}
          </div>
        </div>`
        break
      }
       default :{
        body.innerHTML += `<div id=${radomKey} class="alert alert-danger d-flex align-items-center fadeIn" role="alert" style=" width: 230px;
        position: fixed;
        bottom: 0;
        right: 4px;
        z-index: 2;" hidden>
          <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"></use></svg>
          <div>
            Mensagem não definida
          </div>
        </div>`
      }
    }

    setTimeout(() => {
      document.getElementById(radomKey).classList.add('fadeOut')
      body.innerHTML = ''}, 5000) 
  }

  //-----------------------------------------------------------------------------//

  function loading(acao){
      switch (acao){
        case 'exibir' :{
          document.getElementById('overlay').style.display = 'flex'
          break
        }
        case 'ocultar' :{
          document.getElementById('overlay').style.display = 'none'
          break
        }
        default :{
          console.log('Loading não exibido')
        }
  }
}
  //-----------------------------------------------------------------------------//


  carregarPagina(); 
