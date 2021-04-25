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

  $(document).ready(function() {
    initFirebase();
    initButtonsLoginSignUp();
    initSubmitBtnLoginSignUp();
  });

  /* Inicializar Firebase */
  var initFirebase = function(){
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: "AIzaSyBMWlxH-4dlOlXhqCq6VMgu4ZWchaw1f7c",
        authDomain: "institutonoterix.firebaseapp.com",
        databaseURL: "https://institutonoterix-default-rtdb.firebaseio.com",
        projectId: "institutonoterix",
        storageBucket: "institutonoterix.appspot.com",
        messagingSenderId: "638778265851",
        appId: "1:638778265851:web:4a3b43d4bd0d461743205e",
        measurementId: "G-YYR5S8WP87"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
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
          alert(error.message);
        });
      }
    });
    $(SUBMIT_SIGN_UP).on('click', function(){
      if(validateUser($(EMAIL_SIGN_UP), $(PASSWORD_SIGN_UP))){
        firebase.auth().createUserWithEmailAndPassword($(EMAIL_SIGN_UP).val(), $(PASSWORD_SIGN_UP).val())
        .then((userCredential) => {
          alert("Tu usuario se ha registrado");
          clearFields();
        }).catch((error) => {
          alert(error.message);
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
      alert('Necesitas completar email o es incorrecto');
      return false;
    }
    if (password[0].value.length == 0 || password[0].value.length < 6) {
        alert('Necesitas completar password o no supera los seis caracteres');
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