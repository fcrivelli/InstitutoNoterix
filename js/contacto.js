var contacto = (function() {

    var SLIDER_NAV_BAR = '#sidebarCollapse';
    var SLIDER = '#sidebar';
    var LOGOUT = '#logout';
    var EMAIL = '#e-mail';
    var API_KEY = 'AIzaSyBMWlxH-4dlOlXhqCq6VMgu4ZWchaw1f7c';
    var AUTH_DOMAIN = 'institutonoterix.firebaseapp.com';
    var DATABASE_URL = 'https://institutonoterix-default-rtdb.firebaseio.com';
    var PROJECT_ID = 'institutonoterix';
    var STORAGE_BUCKET = 'institutonoterix.appspot.com';
    var MESSAGING_SENDER_ID = '638778265851';
    var APP_ID = '1:638778265851:web:4a3b43d4bd0d461743205e';
    var MEASUREMENT_ID = 'G-YYR5S8WP87';

    $(document).ready(function() {
        init();
    });

    /* Inicializo mi pantalla */
    var init = function() {
        initNavBar();
        initForm();
        initFirebase();
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
})();