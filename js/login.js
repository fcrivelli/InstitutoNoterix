var login = (function() {

  var LOGIN = '#login';
  var SIGN_UP = '#signup';
  var USER_NAME_SIGN_UP = '#userNameSignUp';
  var EMAIL_SIGN_UP = '#emailSignUp';
  var PASSWORD_SIGN_UP = '#passwordSignUp';
  var EMAIL_LOGIN = '#emailLogin';
  var PASSWORD_LOGIN = '#passwordLogin';
  var SUBMIT_SIGN_UP = '#submitBtnSignUp';
  var SUBMIT_LOGIN = '#submitBtnLogin';
  var API_KEY = 'AIzaSyBMWlxH-4dlOlXhqCq6VMgu4ZWchaw1f7c';
  var AUTH_DOMAIN = 'institutonoterix.firebaseapp.com';
  var DATABASE_URL = 'https://institutonoterix-default-rtdb.firebaseio.com';
  var PROJECT_ID = 'institutonoterix';
  var STORAGE_BUCKET = 'institutonoterix.appspot.com';
  var MESSAGING_SENDER_ID = '638778265851';
  var APP_ID = '1:638778265851:web:4a3b43d4bd0d461743205e';
  var MEASUREMENT_ID = 'G-YYR5S8WP87';
  var MODAL_TEXT = '#modalText';
  var MODAL_TITLE = '#modalTitle';
  var MODAL_DIALOG = '#miModal';
  var MODAL_APPLY = '#acceptModalButton';
  var MODAL_CLOSE = '#closeModalButton';
  var body;
  var displayForm;
  var isEditing;

  $(document).ready(function() {
    initFirebase();
    initButtonsLoginSignUp();
    initSubmitBtnLoginSignUp();
    initModal();
  });

  /* Inicializo Firebase */
  var initFirebase = function() {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        databaseURL: DATABASE_URL,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
        measurementId: MEASUREMENT_ID
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  var initModal = function(){
    $(MODAL_APPLY).on('click', function() {
      hideModalElement();
    });
    $(MODAL_CLOSE).on('click', function(){
      hideModalElement();
    });
    body = document.getElementsByTagName("body")[0];
    if(document.getElementById("btnModal")){
      window.onclick = function(event) {
        if (event.target == modal) {
          hideModalElement();
        }
      }
    }
  }

  var hideModalElement = function(){
    $(MODAL_DIALOG)[0].style.display = "none";
    body.style.position = "inherit";
    body.style.height = "auto";
    body.style.overflow = "visible";
  }

  var showModalElement = function(title, text, isEdited){
      $(MODAL_TEXT).html(text);
      $(MODAL_TITLE).html(title);
      isEditing = isEdited;
      $(MODAL_DIALOG).fadeIn(2000).delay(3000).fadeOut(2000).animate({width: '100%'}, 
      {done: function(){
          if(isEdited) {
              showAndHideForm('none', 'block', ADD_TEACHER);
          }
      }});
      body.style.position = "static";
      body.style.height = "100%";
      body.style.overflow = "hidden";
  }


  /* Inicializo Botones de Inicio y Registro para registro */
  var initSubmitBtnLoginSignUp = function(){
    $(SUBMIT_LOGIN).on('click', function(){
      if(validateUser($(EMAIL_LOGIN), $(PASSWORD_LOGIN))){
        firebase.auth().signInWithEmailAndPassword($(EMAIL_LOGIN).val(), $(PASSWORD_LOGIN).val())
        .then((userCredential) => {
          localStorage.setItem('email', $(EMAIL_LOGIN).val());
          localStorage.setItem('password', $(PASSWORD_LOGIN).val());
          clearFields();
          window.location = "cursos.html";
        }).catch((error) => {
          showModalElement("Inicio Sesion", error.message, false);
        });
      }
    });
    $(SUBMIT_SIGN_UP).on('click', function(){
      if(validateUser($(EMAIL_SIGN_UP), $(PASSWORD_SIGN_UP))){
        firebase.auth().createUserWithEmailAndPassword($(EMAIL_SIGN_UP).val(), $(PASSWORD_SIGN_UP).val())
        .then((userCredential) => {
          showModalElement("Inicio Sesion", "Tu usuario se ha registrado", false);
          clearFields();
        }).catch((error) => {
          showModalElement("Inicio Sesion", error.message, false);
        });
      }
    });
  }

  /* Limpiar campos Formulario */
  var clearFields = function(){
    $(USER_NAME_SIGN_UP).val('');
    $(EMAIL_SIGN_UP).val('');
    $(PASSWORD_SIGN_UP).val('');
    $(EMAIL_LOGIN).val('');
    $(PASSWORD_LOGIN).val('');
  }

  /* Validacion de Usuario */
  var validateUser = function(email, password){
    if (email[0].value.length == 0 || email.val().indexOf('@', 0) == -1 || email.val().indexOf('.', 0) == -1) {
      showModalElement("Inicio Sesion", "Necesitas completar email o es incorrecto", false);
      return false;
    }
    if (password[0].value.length == 0 || password[0].value.length < 6) {
        showModalElement("Inicio Sesion", "Necesitas completar password o no supera los seis caracteres", false);
        return false;
    }
    return true;
  }

  /* Inicializo Botones de cambio de Inicio y Registro */
  var initButtonsLoginSignUp = function(){
    $(LOGIN).on('click', function(e){
        let parent = e.target.parentNode.parentNode;
        Array.from(e.target.parentNode.parentNode.classList).find((element) => {
          if(element !== "slide-up") {
            parent.classList.add('slide-up')
          }else{
            $(EMAIL_LOGIN).val(localStorage.getItem('email'))
            $(PASSWORD_LOGIN).val(localStorage.getItem('password'))
            $(SIGN_UP)[0].parentNode.classList.add('slide-up')
            parent.classList.remove('slide-up')
          }
        });
    });
    $(SIGN_UP).on('click', function(e){
      let parent = e.target.parentNode;
      Array.from(e.target.parentNode.classList).find((element) => {
        if(element !== "slide-up") {
          parent.classList.add('slide-up')
        }else{
          $(LOGIN)[0].parentNode.parentNode.classList.add('slide-up')
          parent.classList.remove('slide-up')
        }
      });
    });
  }

  return {
    
  }

})();