var studentList = [];
var listEmptiesId = [];

/* Objeto a utilizar como curso */
class Student {
    constructor(id, name, lastName, age, nameCourse, email, dni, ocupation) {
        this.id = id === null ? this.uniqueId() : id;
        this.name = name;
        this.lastName = lastName;
        this.age = age;
        this.nameCourse = nameCourse;
        this.email = email;
        this.dni = dni;
        this.ocupation = ocupation;
    }

    /* Genero un id unico para cada estudiante */
    uniqueId() {
        let id = 0;
        if(listEmptiesId !== null && listEmptiesId.length > 0) {
            id = listEmptiesId[listEmptiesId.length - 1];
            listEmptiesId.splice(listEmptiesId.length-1, 1);
            return id;
        } else {
            for (const student of studentList) {
                if (parseInt(student.id) > id) {
                    id = student.id;
                }
            }
        }
        return (id + 1);
    }
}

var chargeStudent = (function() {

    var NAME_STUDENT_ID = '#NameStudentCb';
    var LAST_NAME_STUDENT_ID = '#LastNameStudentCb';
    var AGE_ID = '#AgeCb';
    var NAME_COURSE_ID = '#NameCourseCb';
    var OCUPATION_ID = '#OcupationCb';
    var EMAIL_ID = '#EmailCb';
    var DNI_ID = '#DniCb';
    var FORM_INPUT_ID = '#FormInput';
    var BUTTON_SAVE_CANCEL_ID = '#BtnSaveCancel';
    var HIDE_SHOW_FORM = '#HideShowForm';
    var BTN_HIDE_SHOW_FORM = '#BtnHideShow';
    var BTN_SUCCESS = '#saveButton';
    var BTN_CANCEL = '#cancelButton';
    var TABLE_ID = '#StudentsTable';
    var CONTAINER = '#Container';
    var EXPORT_EXCEL = '#btnExportar';
    var ADD_STUDENT = 'Agregar alumno';
    var HIDE_FORM = 'Ocultar formulario';
    var studentIdToEdit = "";
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
                filename: "ListaAlumnos", //Nombre del archivo de Excel
                sheetname: "ListaAlumnos", //Título de la hoja
            });
            let datos = tableExport.getExportData();
            let preferenciasDocumento = datos.StudentsTable.xlsx;
            tableExport.export2file(preferenciasDocumento.data, preferenciasDocumento.mimeType, preferenciasDocumento.filename, preferenciasDocumento.fileExtension, preferenciasDocumento.merges, preferenciasDocumento.RTL, preferenciasDocumento.sheetname);
        });
    }

    /* Formulario */
    /* Inicializo Formulario y botones de formulario */
    var initForm = function() {
        showAndHideForm('none', 'block', ADD_STUDENT);
        chargeSelectsForm();
        $(BTN_HIDE_SHOW_FORM).on('click', function() {
            this.classList.toggle("active");
            btnHideShowForm();
        });
        $(BTN_CANCEL).on('click', function() {
            cancelStudent();
        });
        $(BTN_SUCCESS).on('click', function() {
            if (validateForm()) {
                saveStudent();
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
            showAndHideForm('none', 'block', ADD_STUDENT);
        } else {
            showAndHideForm('block', 'block', HIDE_FORM);
        }
    }

    /* Validacion Formulario */
    var validateForm = function() {
        if ($(NAME_STUDENT_ID)[0].value.length == 0) {
            showModalElement("Alumnos", "Necesitas completar el Nombre");
            return false;
        }
        if ($(LAST_NAME_STUDENT_ID)[0].value.length == 0) {
            showModalElement("Alumnos", "Necesitas completar el Apellido");
            return false;
        }
        if ($(AGE_ID)[0].value.length == 0) {
            showModalElement("Alumnos", "Necesitas completar la edad");
            return false;
        }
        if ($(OCUPATION_ID)[0].value.length == 0) {
            showModalElement("Alumnos", "Necesitas completar la ocupacion");
            return false;
        }
        if ($(NAME_COURSE_ID)[0].value.length == 0 || $(NAME_COURSE_ID)[0].value === "Seleccionar Curso") {
            showModalElement("Alumnos", "Necesitas completar nombre curso");
            return false;
        }
        if ($(EMAIL_ID)[0].value.length == 0 || $(EMAIL_ID).val().indexOf('@', 0) == -1 || $(EMAIL_ID).val().indexOf('.', 0) == -1) {
            showModalElement("Alumnos", "Necesitas completar email o es incorrecto");
            return false;
        }
        if ($(DNI_ID)[0].value.length == 0 || $(DNI_ID)[0].value.length < 6) {
            showModalElement("Alumnos", "Necesitas completar dni");
            return false;
        }
        return true;
    }

    /* Logica del boton cancel del formulario */
    var cancelStudent = function() {
        showAndHideForm('none', 'block', ADD_STUDENT);
        clearFields();
    }

    /* Limpio el formulario , borrando todos los datos */
    var clearFields = function() {
        $(NAME_STUDENT_ID).val('');
        $(LAST_NAME_STUDENT_ID).val('');
        $(AGE_ID).val('');
        $(OCUPATION_ID).val('');
        $(NAME_COURSE_ID).val('');
        $(EMAIL_ID).val('');
        $(DNI_ID).val('');
    }

    /* Muestro el Curso al que se desea editar */
    var showEdit = function(studentId) {
        var student = studentList.find(student => parseInt(student.id) === studentId);
        studentIdToEdit = student.id;
        $(NAME_STUDENT_ID).val(student.name);
        $(LAST_NAME_STUDENT_ID).val(student.lastName);
        $(AGE_ID).val(student.age);
        $(NAME_COURSE_ID).val(setValueSelected($(NAME_COURSE_ID)[0], student.nameCourse));
        $(OCUPATION_ID).val(setValueSelected($(OCUPATION_ID)[0], student.ocupation));
        $(EMAIL_ID).val(student.email);
        $(DNI_ID).val(student.dni);
        if($(FORM_INPUT_ID)[0].style.display === 'block'){
            $(BTN_HIDE_SHOW_FORM)[0].classList.toggle("active"); 
        }
        showAndHideForm('block', 'none', ADD_STUDENT);
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
                    "sTitle": "Ocupación",
                    "mData": "ocupation",
                    "bSearchable": true
                },
                {
                    "sTitle": "Opciones",
                    "sortable": false,
                    "render": function(data, type, full, meta) {
                        var buttons = "";
                        buttons += `<button onclick="chargeStudent.showEdit(${full.id})" class="fa fa-pencil"></button>`
                        buttons += `<button onclick="chargeStudent.deleteValue(${full.id})" class="fa fa-trash"></button>`
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
                    addStudentsToList(data.alumnos);
                    sessionStorage.setItem('alumnos', JSON.stringify(studentList));
                    loadTable();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    showModalElement("Alumnos", "Error en el pedido de alumnos.");
                    studentList = JSON.parse(sessionStorage.getItem('alumnos'));
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
    var addStudentsToList = function(data) {
        if(data !== null){
            var map = new Map(Object.entries(data));
            for (var [id, value] of map){
                if(value !== null){
                    value = checkInfo(value);
                    studentList.push(value);
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
        value.ocupation = value.ocupation === undefined? "" : value.ocupation;
        return value;  
    }

    /* Edito el alumno cargado o creo una nueva instancia */
    var saveStudent = function() {
        if (studentIdToEdit === "") { //Nuevo alumno
            createNewStudent();
        } else { // Edicion alumno
            updateStudent();
        }
        sessionStorage.setItem('alumnos', JSON.stringify(studentList));
        loadTable();
        clearFields();
    };

    /* Crear un nuevo Item */
    var createNewStudent = function(){
        var  newStudent = new Student(
            null,
            $(NAME_STUDENT_ID).val(),
            $(LAST_NAME_STUDENT_ID).val(),
            $(AGE_ID).val(),
            getValueSelected($(NAME_COURSE_ID)[0]),
            $(EMAIL_ID).val(),
            $(DNI_ID).val(),
            getValueSelected($(OCUPATION_ID)[0]),
        );
        studentList.push(newStudent);
        firebase.database().ref(`alumnos/${newStudent.id}/`).set({
            id : newStudent.id,
            name : newStudent.name,
            lastName : newStudent.lastName,
            age : newStudent.age,
            nameCourse : newStudent.nameCourse,
            email : newStudent.email,
            dni : newStudent.dni,
            ocupation : newStudent.ocupation
        }).then(function() {
            showModalElement("Alumnos", "Alumno creado correctamente");
        }).catch(function(error) {
            showModalElement("Alumnos", "Se detecto un error");
        });
    }

    /* Editando un alumno */
    var updateStudent = function(){
        var studentToEdit = studentList.find(student => student.id === studentIdToEdit);
        studentToEdit.name = $(NAME_STUDENT_ID).val();
        studentToEdit.lastName = $(LAST_NAME_STUDENT_ID).val();
        studentToEdit.age = $(AGE_ID).val();
        studentToEdit.nameCourse = getValueSelected($(NAME_COURSE_ID)[0]);
        studentToEdit.ocupation = getValueSelected($(OCUPATION_ID)[0]);
        studentToEdit.email = $(EMAIL_ID).val();
        studentToEdit.dni = $(DNI_ID).val();
        firebase.database().ref(`alumnos/${studentToEdit.id}/`).update({
            id : studentToEdit.id,
            name : studentToEdit.name,
            lastName : studentToEdit.lastName,
            age : studentToEdit.age,
            nameCourse : studentToEdit.nameCourse,
            ocupation : studentToEdit.ocupation,
            email : studentToEdit.email,
            dni : studentToEdit.dni
        }).then(function() {
            showModalElement("Alumnos", "Alumno editado correctamente");
        }).catch(function(error) {
            showModalElement("Alumnos", "Se detecto un error");
        });
        showAndHideForm('none', 'block', ADD_STUDENT);
        studentIdToEdit = "";
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

    /* Actualizar tabla */
    var loadTable = function() {
        $(TABLE_ID).dataTable().fnClearTable();
        if (studentList.length > 0) {
            $(TABLE_ID).dataTable().fnAddData(studentList);
        }
        $(TABLE_ID).dataTable().fnDraw();
    }

    /* Eliminar un item de la tabla y de la base  */
    var deleteValue = function(Id) {
        firebase.database().ref(`alumnos/${Id}/`).remove()
        .then(function() {
            showModalElement("Alumnos", "Alumno borrado correctamente");
            studentList.forEach(function(student, index, object) {
                if (parseInt(student.id) === Id) {
                    object.splice(index, 1);
                }
            });
            loadTable();
        }).catch(function(error) {
            showModalElement("Alumnos", "Se detecto un error");
        });;
    }

    /* LogOut sesion */
    var logout = function(){
        firebase.auth().signOut().then(() => {
            showModalElement("Alumnos", "Cierre de sesion");
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