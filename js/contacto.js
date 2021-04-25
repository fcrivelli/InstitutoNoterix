
var contacto = (function(){
    var SLIDER_NAV_BAR = '#sidebarCollapse';
    var SLIDER = '#sidebar';
    var LOGOUT = '#logout';
    var EMAIL = '#e-mail';

    $(document).ready(function() {
        init();
    });

    /* Inicializo mi pantalla */
    var init = function() {
        initNavBar();
        initForm();
    };

    var initForm = function(){
        $(EMAIL).val(localStorage.getItem('email'));
    }

    var initNavBar = function(){
        $(SLIDER_NAV_BAR).on('click', function(){
            $(SLIDER).toggleClass('active');
        });
        $(LOGOUT).on('click', function(){
            logout();
        });
    }

    /* LogOut sesion */
    var logout = function(){
        firebase.auth().signOut().then(() => {
            alert("Cierre de sesion");
            window.location = "index.html";
        }).catch((error) => {
            // An error happened.
        });
    }


    return{

    }
});