var teacherList = [];
var listEmptiesId = [];

/* Objeto a utilizar como curso */
class Teacher {
    constructor(id, name, lastName, age, nameCourse, degree, email, dni) {
        this.id = id === null ? this.uniqueId() : id;
        this.name = name;
        this.lastName = lastName;
        this.age = age;
        this.nameCourse = nameCourse;
        this.degree = degree;
        this.email = email;
        this.dni = dni;
    }

    /* Genero un id unico para cada estudiante */
    uniqueId() {
        let id = 0;
        if(listEmptiesId !== null && listEmptiesId.length > 0) {
            id = listEmptiesId[listEmptiesId.length - 1];
            listEmptiesId.splice(listEmptiesId.length-1, 1);
            return id;
        } else {
            for (const teacher of teacherList) {
                if (parseInt(teacher.id) > id) {
                    id = teacher.id;
                }
            }
        }
        return (id + 1);
    }
}

var chargeTeacher = (function() {

    var NAME_TEACHER_ID = '#NameTeacherCb';
    var LAST_NAME_TEACHER_ID = '#LastNameTeacherCb';
    var DEGREE_ID = "#DegreeCb";
    var AGE_ID = '#AgeCb';
    var NAME_COURSE_ID = '#NameCourseCb';
    var EMAIL_ID = '#EmailCb';
    var DNI_ID = '#DniCb';
    var FORM_INPUT_ID = '#FormInput';
    var BUTTON_SAVE_CANCEL_ID = '#BtnSaveCancel';
    var HIDE_SHOW_FORM = '#HideShowForm';
    var BTN_HIDE_SHOW_FORM = '#BtnHideShow';
    var BTN_SUCCESS = '#saveButton';
    var BTN_CANCEL = '#cancelButton';
    var TABLE_ID = '#TeachersTable';
    var CONTAINER = '#Container';
    var EXPORT_EXCEL = '#btnExportar';
    var ADD_TEACHER = 'Agregar profesor';
    var HIDE_FORM = 'Ocultar formulario';
    var teacherIdToEdit = "";
    var GET_DATA_FIREBASE_URL = 'https://institutonoterix-default-rtdb.firebaseio.com/.json';
    var API_KEY = 'AIzaSyBMWlxH-4dlOlXhqCq6VMgu4ZWchaw1f7c';
    var AUTH_DOMAIN = 'institutonoterix.firebaseapp.com';
    var DATABASE_URL = 'https://institutonoterix-default-rtdb.firebaseio.com';
    var PROJECT_ID = 'institutonoterix';
    var STORAGE_BUCKET = 'institutonoterix.appspot.com';
    var MESSAGING_SENDER_ID = '638778265851';
    var APP_ID = '1:638778265851:web:4a3b43d4bd0d461743205e';
    var MEASUREMENT_ID = 'G-YYR5S8WP87';
    var table;
    var SLIDER_NAV_BAR = '#sidebarCollapse';
    var SLIDER = '#sidebar';
    var LOGOUT = '#logout';
    var MODAL_TEXT = '#modalText';
    var MODAL_TITLE = '#modalTitle';
    var MODAL_DIALOG = '#miModal';
    var MODAL_APPLY = '#acceptButton';
    var body;

    $(document).ready(function() {
        init();
    });

    /* Inicializo mi pantalla */
    var init = function() {
        initNavBar();
        initFirebase();
        initForm();
        initTable();
        initExportExcel();
    };

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

    /* Exportar Excel de la tabla */
    var initExportExcel = function(){
        const $btnExportar = document.querySelector(EXPORT_EXCEL),
        $tabla = document.querySelector(TABLE_ID);

        $btnExportar.addEventListener("click", function() {
            let tableExport = new TableExport($tabla, {
                exportButtons: false, // No queremos botones
                filename: "ListaProfesores", //Nombre del archivo de Excel
                sheetname: "ListaProfesores", //Título de la hoja
            });
            let datos = tableExport.getExportData();
            let preferenciasDocumento = datos.TeachersTable.xlsx;
            tableExport.export2file(preferenciasDocumento.data, preferenciasDocumento.mimeType, preferenciasDocumento.filename, preferenciasDocumento.fileExtension, preferenciasDocumento.merges, preferenciasDocumento.RTL, preferenciasDocumento.sheetname);
        });
    }

    /* Formulario */
    /* Inicializo Formulario y botones de formulario */
    var initForm = function() {
        showAndHideForm('none', 'block', ADD_TEACHER);
        chargeSelectsForm();
        $(BTN_HIDE_SHOW_FORM).on('click', function() {
            this.classList.toggle("active");
            btnHideShowForm();
        });
        $(BTN_CANCEL).on('click', function() {
            cancelTeacher();
        });
        $(BTN_SUCCESS).on('click', function() {
            if (validateForm()) {
                saveTeacher();
            }
        });
        $(MODAL_APPLY).on('click', function() {
            hideModalElement();
        });
        body = document.getElementsByTagName("body")[0];
        span = document.getElementsByClassName("close")[0];
        if(document.getElementById("btnModal")){
			span.onclick = function() {
				hideModalElement();
			}
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

    var showModalElement = function(title, text){
        $(MODAL_TEXT).html(text);
        $(MODAL_TITLE).html(title);
        $(MODAL_DIALOG)[0].style.display = "block";
        body.style.position = "static";
        body.style.height = "100%";
        body.style.overflow = "hidden";
    }

    var chargeSelectsForm = function(){
        if(navigator.onLine){
            firebase.database().ref(`cursos`).on('value', function(data) {
                chargeSelect($(NAME_COURSE_ID)[0], generateArray(data.val()));
            });
        } else {
            chargeSelect($(NAME_COURSE_ID)[0], generateArray(JSON.parse(sessionStorage.getItem('cursos'))));
        }
    }

    /* Generar un array desde un mapa */
    var generateArray = function(dataArray){
        var array = new Array();
        if(dataArray !== null) {
            for (var value of dataArray){
                array.push(value.name);
            }
        }
        return array;
    }

    /* Cargar un elemento select */
    var chargeSelect = function(select, array){
        for(var i=0;i<array.length;i++){
            var option = document.createElement("option");
            option.text = array[i];
            option.value = i + 1; 
            select.add(option);
        }
    }

    /* Muestro y Oculto el formulario */
    var showAndHideForm = function(showForm, showBtn, txtBtn) {
        showForm === 'none'? $(FORM_INPUT_ID).slideUp() : $(FORM_INPUT_ID).slideDown();
        showForm === 'none'? $(BUTTON_SAVE_CANCEL_ID).slideUp() : $(BUTTON_SAVE_CANCEL_ID).slideDown();
        showBtn === 'none' ? $(HIDE_SHOW_FORM).slideUp() : $(HIDE_SHOW_FORM).slideDown();
        $(FORM_INPUT_ID)[0].style.display = showForm;
        $(BUTTON_SAVE_CANCEL_ID)[0].style.display = showForm;
        $(HIDE_SHOW_FORM)[0].style.display = showBtn;
        $(BTN_HIDE_SHOW_FORM)[0].title = txtBtn;
    }

    /* Logica para mostrar y ocultar el formulario  */
    var btnHideShowForm = function() {
        if ($(FORM_INPUT_ID)[0].style.display === 'block') {
            showAndHideForm('none', 'block', ADD_TEACHER);
        } else {
            showAndHideForm('block', 'block', HIDE_FORM);
        }
    }

    /* Validacion Formulario */
    var validateForm = function() {
        if ($(NAME_TEACHER_ID)[0].value.length == 0) {
            showModalElement("Profesores", "Necesitas completar el Nombre");
            return false;
        }
        if ($(LAST_NAME_TEACHER_ID)[0].value.length == 0) {
            showModalElement("Profesores", "Necesitas completar el Apellido");
            return false;
        }
        if ($(DEGREE_ID)[0].value.length == 0) {
            showModalElement("Profesores", "Necesitas completar el Titulo");
            return false;
        }
        if ($(AGE_ID)[0].value.length == 0) {
            showModalElement("Profesores", "Necesitas completar la edad");
            return false;
        }
        if ($(NAME_COURSE_ID)[0].value.length == 0 || $(NAME_COURSE_ID)[0].value === "Seleccionar Curso") {
            showModalElement("Profesores", "Necesitas completar nombre curso");
            return false;
        }
        if ($(EMAIL_ID)[0].value.length == 0 || $(EMAIL_ID).val().indexOf('@', 0) == -1 || $(EMAIL_ID).val().indexOf('.', 0) == -1) {
            showModalElement("Profesores", "Necesitas completar email o es incorrecto");
            return false;
        }
        if ($(DNI_ID)[0].value.length == 0 || $(DNI_ID)[0].value.length < 6) {
            showModalElement("Profesores", "Necesitas completar dni");
            return false;
        }
        return true;
    }

    /* Logica del boton cancel del formulario */
    var cancelTeacher = function() {
        showAndHideForm('none', 'block', ADD_TEACHER);
        clearFields();
    }

    /* Limpio el formulario , borrando todos los datos */
    var clearFields = function() {
        $(NAME_TEACHER_ID).val('');
        $(LAST_NAME_TEACHER_ID).val('');
        $(DEGREE_ID).val('');
        $(AGE_ID).val('');
        $(NAME_COURSE_ID).val('');
        $(EMAIL_ID).val('');
        $(DNI_ID).val('');
    }

    /* Muestro el Curso al que se desea editar */
    var showEdit = function(teacherId) {
        var teacher = teacherList.find(teacher => parseInt(teacher.id) === teacherId);
        teacherIdToEdit = teacher.id;
        $(NAME_TEACHER_ID).val(teacher.name);
        $(LAST_NAME_TEACHER_ID).val(teacher.lastName);
        $(DEGREE_ID).val(teacher.degree);
        $(AGE_ID).val(teacher.age);
        $(NAME_COURSE_ID).val(setValueSelected($(NAME_COURSE_ID)[0], teacher.nameCourse));
        $(EMAIL_ID).val(teacher.email);
        $(DNI_ID).val(teacher.dni);
        if($(FORM_INPUT_ID)[0].style.display === 'block'){
            $(BTN_HIDE_SHOW_FORM)[0].classList.toggle("active"); 
        }
        showAndHideForm('block', 'none', ADD_TEACHER);
    }

    /* Tabla */
    /* Le doy formato a la tabla */
    var initTable = function() {
        table = $(TABLE_ID).DataTable({
            "aoColumns": [{
                    "sTitle": "ID",
                    "mData": "id",
                    "bSearchable": true
                },
                {
                    "sTitle": "Nombre",
                    "mData": "name",
                    "bSearchable": true
                },
                {
                    "sTitle": "Apellido",
                    "mData": "lastName",
                    "bSearchable": true
                },
                {
                    "sTitle": "Edad",
                    "mData": "age",
                    "bSearchable": true
                },
                {
                    "sTitle": "Titulo",
                    "mData": "degree",
                    "bSearchable": true
                },
                {
                    "sTitle": "Curso",
                    "mData": "nameCourse",
                    "bSearchable": true
                },
                {
                    "sTitle": "Email",
                    "mData": "email",
                    "bSearchable": true
                },
                {
                    "sTitle": "DNI",
                    "mData": "dni",
                    "bSearchable": true
                },
                {
                    "sTitle": "Opciones",
                    "sortable": false,
                    "render": function(data, type, full, meta) {
                        var buttons = "";
                        buttons += `<button onclick="chargeTeacher.showEdit(${full.id})" class="fa fa-pencil"></button>`
                        buttons += `<button onclick="chargeTeacher.deleteValue(${full.id})" class="fa fa-trash"></button>`
                        return buttons;
                    },
                    "bSearchable": true
                },
            ],
            "scrollY": "300px",
            "scrollX": true,
            "scrollCollapse": true,
            "paging": false,
            "columnDefs": [
                { width: '20%', targets: 0 }
            ],
            "ajax": {
                url: GET_DATA_FIREBASE_URL,
                success: function(data) {
                    addTeachersToList(data.profesores);
                    sessionStorage.setItem('profesores', JSON.stringify(teacherList));
                    loadTable();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    showModalElement("Profesores", "Error en el pedido de profesores.");
                    teacherList = JSON.parse(sessionStorage.getItem('profesores'));
                    loadTable();
                }
            },
            "fixedColumns": true,
            "serverSide": false,
            "deferLoading": 0,
            "order": [
                [1, "asc"]
            ]
        });
        $(CONTAINER).css('display', 'block');
        table.columns.adjust().draw();
    }

    /* Adherir cursos a la lista */
    var addTeachersToList = function(data) {
        if(data !== null){
            var map = new Map(Object.entries(data));
            for (var [id, value] of map){
                if(value !== null){
                    value = checkInfo(value);
                    teacherList.push(value);
                } else {
                    listEmptiesId.push(id);
                }
            }
        }
    }

    /* Chequear informacion para evitar vacios o indefinidos */
    var checkInfo = function(value){
        value.name = value.name === undefined? "" : value.name;
        value.lastName = value.lastName === undefined? "" : value.lastName; 
        value.age = value.age === undefined? "" : value.age; 
        value.nameCourse = value.nameCourse === undefined? "" : value.nameCourse; 
        value.email = value.email === undefined? "" : value.email; 
        value.dni = value.dni === undefined? "" : value.dni;
        value.degree = value.degree === undefined? "" : value.degree;
        return value;  
    }

    /* Edito el profesor cargado o creo una nueva instancia */
    var saveTeacher = function() {
        if (teacherIdToEdit === "") { //Nuevo alumno
            createNewTeacher();
        } else { // Edicion alumno
            updateTeacher();
        }    
        sessionStorage.setItem('profesores', JSON.stringify(teacherList));
        loadTable();
        clearFields();
    };

    /* Crear un nuevo Item */
    var createNewTeacher = function(){
        var newTeacher = new Teacher(
            null,
            $(NAME_TEACHER_ID).val(),
            $(LAST_NAME_TEACHER_ID).val(),
            $(DEGREE_ID).val(),
            $(AGE_ID).val(),
            getValueSelected($(NAME_COURSE_ID)[0]),
            $(EMAIL_ID).val(),
            $(DNI_ID).val(),
        );
        teacherList.push(newTeacher);
        firebase.database().ref(`profesores/${newTeacher.id}/`).set({
            id : newTeacher.id,
            name : newTeacher.name,
            lastName : newTeacher.lastName,
            age : newTeacher.age,
            nameCourse : newTeacher.nameCourse,
            email : newTeacher.email,
            dni : newTeacher.dni,
            degree : newTeacher.degree
        }).then(function() {
            showModalElement("Profesores", "Profesor creado correctamente");
        }).catch(function(error) {
            showModalElement("Profesores", "detectado un error");
        });
    }

    /* Editando un profesor */
    var updateTeacher = function(){
        var teacherToEdit = teacherList.find(teacher => teacher.id === teacherIdToEdit);
        teacherToEdit.name = $(NAME_TEACHER_ID).val();
        teacherToEdit.lastName = $(LAST_NAME_TEACHER_ID).val();
        teacherToEdit.degree = $(DEGREE_ID).val();
        teacherToEdit.age = $(AGE_ID).val();
        teacherToEdit.nameCourse = getValueSelected($(NAME_COURSE_ID)[0]);
        teacherToEdit.email = $(EMAIL_ID).val();
        teacherToEdit.dni = $(DNI_ID).val();
        firebase.database().ref(`profesores/${teacherToEdit.id}/`).update({
            id : teacherToEdit.id,
            name : teacherToEdit.name,
            lastName : teacherToEdit.lastName,
            age : teacherToEdit.age,
            nameCourse : teacherToEdit.nameCourse,
            degree : teacherToEdit.degree,
            email : teacherToEdit.email,
            dni : teacherToEdit.dni
        }).then(function() {
            showModalElement("Profesores", "Profesor editado correctamente");
        }).catch(function(error) {
            showModalElement("Profesores", "detectado un error");
        });
        showAndHideForm('none', 'block', ADD_TEACHER);
        teacherIdToEdit = "";
    }

    /* Actualizar tabla */
    var loadTable = function() {
        $(TABLE_ID).dataTable().fnClearTable();
        if (teacherList.length > 0) {
            $(TABLE_ID).dataTable().fnAddData(teacherList);
        }
        $(TABLE_ID).dataTable().fnDraw();
    }

    /* Uso esta funcion ya que la lista desplegable guarda el valor de la opcion no el contenido */
    var setValueSelected = function(select, text) {
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].text === text) {
                return i;
            }
        }
    }

    /* Uso esta funcion ya que la lista desplegable guarda el valor de la opcion no el contenido */
    var getValueSelected = function(select) {
        return select.options[select.selectedIndex].text; //Obtengo el valor en formato texto.
    }

    /* Eliminar un item de la tabla y de la base  */
    var deleteValue = function(Id) {
        firebase.database().ref(`profesores/${Id}/`).remove()
        .then(function() {
            showModalElement("Profesores", "Profesor borrado correctamente");
            teacherList.forEach(function(teacher, index, object) {
                if (parseInt(teacher.id) === Id) {
                    object.splice(index, 1);
                }
            });
            loadTable();
        }).catch(function(error) {
            showModalElement("Profesores", "Se detecto un error");
        });;
    }

    /* LogOut sesion */
    var logout = function(){
        firebase.auth().signOut().then(() => {
            showModalElement("Profesores", "Cierre de sesion");
            window.location = "index.html";
        }).catch((error) => {
            // An error happened.
        });
    }

    return {
        init: init,
        deleteValue: deleteValue,
        showEdit: showEdit,
        logout: logout
    }

})();