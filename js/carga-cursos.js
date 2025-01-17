const precieHour = 150;
var courseList = [];
var listEmptiesId = [];

/* Objeto a utilizar como curso */
class Course {
    constructor(id, name, hoursTime, daysTime, mainTeacher, secondTeacher, date, type, vacancies) {
        this.id = id === null ? this.uniqueId() : id;
        this.name = name;
        this.hoursTime = hoursTime;
        this.daysTime = daysTime;
        this.mainTeacher = mainTeacher;
        this.secondTeacher = secondTeacher;
        this.date = date;
        this.type = type;
        this.vacancies = vacancies;
        this.price = this.calculatePrecie(hoursTime, daysTime);
    }

    /* Calculo precio de curso fijando un precio por hora */
    calculatePrecie(hoursTime, daysTime) {
        return daysTime * hoursTime * precieHour;
    }

    /* Genero un id unico para cada curso */
    uniqueId() {
        let id = 0;
        if(listEmptiesId !== null && listEmptiesId.length > 0) {
            id = listEmptiesId[listEmptiesId.length - 1];
            listEmptiesId.splice(listEmptiesId.length-1, 1);
            return id;
        } else {
            for (const course of courseList) {
                if (parseInt(course.id) > id) {
                    id = parseInt(course.id);
                }
            }
        }
        return (id + 1);
    }
}

var chargeCourse = (function() {

    var COURSE_ID = '#CourseCb';
    var STUDENTS_ID = '#ValueStudents';
    var PRECIE_ID = '#ValuePromPrecie';
    var MAIN_TEACHER_ID = '#MainTeacherCb';
    var SECOND_TEACHER_ID = '#SecondTeacherCb';
    var DATE_ID = '#DateTb';
    var AMOUNT_VACANCIES_ID = '#AmountVacanciesDp';
    var AMOUNT_DAYS_ID = '#AmountDaysDp';
    var TYPE_ID = '#TypeCourseCb';
    var HOUR_ID = '#HourDp';
    var FORM_INPUT_ID = '#FormInput';
    var BUTTON_SAVE_CANCEL_ID = '#BtnSaveCancel';
    var HIDE_SHOW_FORM = '#HideShowForm';
    var BTN_HIDE_SHOW_FORM = '#BtnHideShow';
    var BTN_SUCCESS = '#saveButton';
    var BTN_CANCEL = '#cancelButton';
    var SELECT_MAIN_TEACHER = '#MainTeacherCb';
    var SELECT_SECOND_TEACHER = '#SecondTeacherCb';
    var EXPORT_EXCEL = '#btnExportar';
    var TABLE_ID = '#CoursesTable';
    var CONTAINER = '#Container';
    var ADD_COURSE = 'Agregar curso';
    var HIDE_FORM = 'Ocultar formulario';
    var courseIdToEdit = "";
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
    var MODAL_APPLY = '#acceptModalButton';
    var MODAL_CLOSE = '#closeModalButton';
    var body;
    var displayForm;
    var isEditing;

    $(document).ready(function() {
        initStorage();
    });

    /* Inicializo mi pantalla */
    var init = function() {
        initNavBar();
        initFirebase();
        initForm();
        initTable();
        initExportExcel();
    };

    var initStorage = function(){
        $.ajax({
            url: GET_DATA_FIREBASE_URL,
            success: function() {
                console.log("Pedido exitoso");
            },
            complete: function(data) {
                sessionStorage.setItem('cursos', JSON.stringify(generateListOfObject(data.responseJSON.cursos)));
                sessionStorage.setItem('profesores', JSON.stringify(generateListOfObject(data.responseJSON.profesores)));
                sessionStorage.setItem('alumnos', JSON.stringify(generateListOfObject(data.responseJSON.alumnos)));
                init();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error en el pedido de info.");
            }
        });
    }

     /* Adherir cursos a la lista */
     var generateListOfObject = function(data) {
        var newArray = [];
        if(data !== null){
            var map = new Map(Object.entries(data));
            for (var [id, value] of map){
                if(value !== null){
                    newArray.push(value);
                }
            } 
        }
        return newArray;
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

    /* Exportar Excel de la tabla */
    var initExportExcel = function(){
        const $btnExportar = document.querySelector(EXPORT_EXCEL),
        $tabla = document.querySelector(TABLE_ID);

        $btnExportar.addEventListener("click", function() {
            let tableExport = new TableExport($tabla, {
                exportButtons: false, // No queremos botones
                filename: "ListaCursos", //Nombre del archivo de Excel
                sheetname: "ListaCursos", //Título de la hoja
            });
            let datos = tableExport.getExportData();
            let preferenciasDocumento = datos.CoursesTable.xlsx;
            tableExport.export2file(preferenciasDocumento.data, preferenciasDocumento.mimeType, preferenciasDocumento.filename, preferenciasDocumento.fileExtension, preferenciasDocumento.merges, preferenciasDocumento.RTL, preferenciasDocumento.sheetname);
        });
    }

    /* Formulario */
    /* Inicializo Formulario y botones de formulario */
    var initForm = function() {
        showAndHideForm('none', 'block', ADD_COURSE);
        chargeSelectsForm();
        $(BTN_HIDE_SHOW_FORM).on("click", function () {
            this.classList.toggle("active");
            btnHideShowForm();
        });
        $(BTN_CANCEL).on('click', function() {
            cancelCourse();
        });
        $(BTN_SUCCESS).on('click', function() {
            if (validateForm()) {
                saveCourse();
            }
        });
        $(MODAL_APPLY).on('click', function() {
            hideModalElement();
            if(isEditing) {
                showAndHideForm('none', 'block', ADD_COURSE);
            }
        });
        $(MODAL_CLOSE).on('click', function(){
            hideModalElement();
            if(isEditing) {
                showAndHideForm('none', 'block', ADD_COURSE);
            }
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
                showAndHideForm('none', 'block', ADD_COURSE);
            }
        }});
        body.style.position = "static";
        body.style.height = "100%";
        body.style.overflow = "hidden";
    }

    var chargeSelectsForm = function(){
        if(navigator.onLine){
            firebase.database().ref(`profesores`).on('value', function(data) {
                chargeSelect($(SELECT_MAIN_TEACHER)[0], generateArray(data.val()));
                chargeSelect($(SELECT_SECOND_TEACHER)[0], generateArray(data.val()));
            });
        } else {
            chargeSelect($(SELECT_MAIN_TEACHER)[0], generateArray(JSON.parse(sessionStorage.getItem('profesores'))));
            chargeSelect($(SELECT_SECOND_TEACHER)[0], generateArray(JSON.parse(sessionStorage.getItem('profesores'))));
        }
    }

    /* Generar un array desde un mapa */
    var generateArray = function(dataArray){
        var array = new Array();
        if(dataArray !== null) {
            for (var value of dataArray){
                array.push(value.name + " " + value.lastName);
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
        if(showForm === 'none'){
            $(FORM_INPUT_ID).slideUp(2000);
            $(BUTTON_SAVE_CANCEL_ID).slideUp(2000);
        } else {
            $(FORM_INPUT_ID).slideDown(2000);
            $(BUTTON_SAVE_CANCEL_ID).slideDown(2000);
        }
        showBtn === 'none' ? $(HIDE_SHOW_FORM).slideUp(2000) : $(HIDE_SHOW_FORM).slideDown(2000);
        $(BTN_HIDE_SHOW_FORM)[0].title = txtBtn;
        displayForm = showForm;
    }

    /* Logica para mostrar y ocultar el formulario  */
    var btnHideShowForm = function() {
        if (displayForm === 'block') {
            showAndHideForm('none', 'block', ADD_COURSE);
        } else {
            showAndHideForm('block', 'block', HIDE_FORM);
        }
    }

    /* Validacion Formulario */
    var validateForm = function() {
        if ($(COURSE_ID)[0].value.length == 0) {
            showModalElement("Cursos", "Necesitas completar el Nombre del Curso", false);
            return false;
        }
        if ($(MAIN_TEACHER_ID)[0].value.length == 0 || $(MAIN_TEACHER_ID)[0].value === "Seleccionar Profesor") {
            showModalElement("Cursos", "Necesitas completar el Nombre del Profesor", false);
            return false;
        }
        if ($(SECOND_TEACHER_ID)[0].value.length == 0 || $(SECOND_TEACHER_ID)[0].value === "Seleccionar Ayudante") {
            showModalElement("Cursos", "Necesitas completar el Nombre del Ayudante", false);
            return false;
        }
        if ($(TYPE_ID)[0].value.length == 0) {
            showModalElement("Cursos", "Necesitas completar el Tipo", false);
            return false;
        }
        if ($(HOUR_ID)[0].value.length == 0) {
            showModalElement("Cursos", "Necesitas completar el Horas Curso", false);
            return false;
        }
        if ($(DATE_ID)[0].value.length == 0) {
            showModalElement("Cursos", "Necesitas completar Fecha", false);
            return false;
        }
        if ($(AMOUNT_VACANCIES_ID)[0].value.length == 0) {
            showModalElement("Cursos", "Necesitas completar Cupos", false);
            return false;
        }
        if ($(AMOUNT_DAYS_ID)[0].value.length == 0) {
            showModalElement("Cursos", "Necesitas completar dias", false);
            return false;
        }
        return true;
    }

    /* Logica del boton cancel del formulario */
    var cancelCourse = function() {
        showAndHideForm('none', 'block', ADD_COURSE);
        clearFields();
    }

    /* Limpio el formulario , borrando todos los datos */
    var clearFields = function() {
        $(COURSE_ID).val('');
        $(MAIN_TEACHER_ID).val('');
        $(SECOND_TEACHER_ID).val('');
        $(TYPE_ID).val('');
        $(HOUR_ID).val('');
        $(DATE_ID).val('');
        $(AMOUNT_VACANCIES_ID).val('');
        $(AMOUNT_DAYS_ID).val('');
    }

    /* Muestro el Curso al que se desea editar */
    var showEdit = function(courseId) {
        var course = courseList.find(course => parseInt(course.id) === courseId);
        courseIdToEdit = course.id;
        $(COURSE_ID).val(course.name);
        $(MAIN_TEACHER_ID).val(setValueSelected($(MAIN_TEACHER_ID)[0], course.mainTeacher));
        $(SECOND_TEACHER_ID).val(setValueSelected($(SECOND_TEACHER_ID)[0], course.secondTeacher));
        $(TYPE_ID).val(setValueSelected($(TYPE_ID)[0], course.type));
        $(HOUR_ID).val(course.hoursTime);
        $(DATE_ID).val(course.date);
        $(AMOUNT_VACANCIES_ID).val(course.vacancies);
        $(AMOUNT_DAYS_ID).val(course.daysTime);
        if($(FORM_INPUT_ID)[0].style.display === 'block'){
            $(BTN_HIDE_SHOW_FORM)[0].classList.toggle("active"); 
        }
        showAndHideForm('block', 'none', ADD_COURSE);
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
                    "sTitle": "Profesor",
                    "mData": "mainTeacher",
                    "bSearchable": true
                },
                {
                    "sTitle": "Ayudante",
                    "mData": "secondTeacher",
                    "bSearchable": true
                },
                {
                    "sTitle": "Tipo",
                    "mData": "type",
                    "bSearchable": true
                },
                {
                    "sTitle": "Dias",
                    "mData": "daysTime",
                    "bSearchable": true
                },
                {
                    "sTitle": "Cupos",
                    "mData": "vacancies",
                    "bSearchable": true
                },
                {
                    "sTitle": "Horas",
                    "mData": "hoursTime",
                    "bSearchable": true
                },
                {
                    "sTitle": "Precio",
                    "mData": "price",
                    "bSearchable": true
                },
                {
                    "sTitle": "Fecha",
                    "mData": "date",
                    "bSearchable": true,
                    "render": function(data, type, row, meta) {
                        return data != null ? data : "N/A";
                    }
                },
                {
                    "sTitle": "Opciones",
                    "sortable": false,
                    "render": function(data, type, full, meta) {
                        var buttons = "";
                        buttons += `<button onclick="chargeCourse.showEdit(${full.id})" class="fa fa-pencil"></button>`
                        buttons += `<button onclick="chargeCourse.deleteValue(${full.id})" class="fa fa-trash"></button>`
                        buttons += `<select><option value="1">En Curso</option><option value="2">Finalizado</option></select>`;
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
                    addCoursesToList(data.cursos);
                    sessionStorage.setItem('cursos', JSON.stringify(courseList));
                    loadTable();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    showModalElement("Cursos", "Error en el pedido de cursos.", false);
                    courseList = JSON.parse(sessionStorage.getItem('cursos'));
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
    var addCoursesToList = function(data) {
        if(data !== null){
            var map = new Map(Object.entries(data));
            for (var [id, value] of map){
                if(value !== null){
                    value = checkInfo(value);
                    courseList.push(value);
                } else {
                    listEmptiesId.push(id);
                }
            } 
        }
        calculateStudentsAndPromPrecie();
    }

    /* Chequear informacion para evitar vacios o indefinidos */
    var checkInfo = function(value){
        value.name = value.name === undefined? "" : value.name;
        value.hoursTime = value.hoursTime === undefined? "0" : value.hoursTime; 
        value.daysTime = value.daysTime === undefined? "0" : value.daysTime; 
        value.mainTeacher = value.mainTeacher === undefined? "" : value.mainTeacher; 
        value.secondTeacher = value.secondTeacher === undefined? "" : value.secondTeacher; 
        value.date = value.date === undefined? "" : value.date;
        value.type = value.type === undefined? "" : value.type;
        value.vacancies = value.vacancies === undefined? "0" : value.vacancies;
        value.price = value.price === undefined? "0" : value.price;
        return value;  
    }

    /* Guardo el curso cargado o creando una nueva instancia */
    var saveCourse = function() {
        if (courseIdToEdit === "") { //Nuevo curso
            createNewCourse();
        } else { // Edicion Curso
            updateCourse();
        }
        sessionStorage.setItem('cursos', JSON.stringify(courseList));
        loadTable();
        calculateStudentsAndPromPrecie();
        clearFields();
    };

    /* Editar un Item */
    var updateCourse = function(){
        var courseToEdit = courseList.find(course => course.id === courseIdToEdit);
        courseToEdit.name = $(COURSE_ID).val();
        courseToEdit.hoursTime = $(HOUR_ID).val();
        courseToEdit.daysTime = $(AMOUNT_DAYS_ID).val();
        courseToEdit.mainTeacher = getValueSelected($(MAIN_TEACHER_ID)[0]);
        courseToEdit.secondTeacher = getValueSelected($(SECOND_TEACHER_ID)[0]);
        courseToEdit.date = $(DATE_ID).val();
        courseToEdit.type = getValueSelected($(TYPE_ID)[0]);
        courseToEdit.vacancies = $(AMOUNT_VACANCIES_ID).val();
        firebase.database().ref(`cursos/${courseToEdit.id}/`).update({
            id : courseToEdit.id,
            name : courseToEdit.name,
            hoursTime : courseToEdit.hoursTime,
            daysTime : courseToEdit.daysTime,
            mainTeacher : courseToEdit.mainTeacher,
            secondTeacher : courseToEdit.secondTeacher,
            date : courseToEdit.date,
            type : courseToEdit.type,
            vacancies : courseToEdit.vacancies
        }).then(function() {
            showModalElement("Cursos", "Curso editado correctamente", true);
        }).catch(function(error) {
            showModalElement("Cursos", "detectado un error", true);
        });
        courseIdToEdit = "";
    }

    /* Crear un nuevo Item */
    var createNewCourse = function(){
        var newCourse = new Course(
            null,
            $(COURSE_ID).val(),
            $(HOUR_ID).val(),
            $(AMOUNT_DAYS_ID).val(),
            getValueSelected($(MAIN_TEACHER_ID)[0]),
            getValueSelected($(SECOND_TEACHER_ID)[0]),
            $(DATE_ID).val(),
            getValueSelected($(TYPE_ID)[0]),
            $(AMOUNT_VACANCIES_ID).val(),
        );
        courseList.push(newCourse);
        firebase.database().ref(`cursos/${newCourse.id}/`).set({
            id : newCourse.id,
            name : newCourse.name,
            hoursTime : newCourse.hoursTime,
            daysTime : newCourse.daysTime,
            mainTeacher : newCourse.mainTeacher,
            secondTeacher : newCourse.secondTeacher,
            date : newCourse.date,
            type : newCourse.type,
            vacancies : newCourse.vacancies
        }).then(function() {
            showModalElement("Cursos", "Curso creado correctamente", false);
        }).catch(function(error) {
            showModalElement("Cursos", "detectado un error", false);
        });
    }

    /* Actualizar tabla */
    var loadTable = function() {
        $(TABLE_ID).dataTable().fnClearTable();
        if (courseList.length > 0) {
            $(TABLE_ID).dataTable().fnAddData(courseList);
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

    /* Calculo el precio promedio y la cantidad de estudiantes */
    var calculateStudentsAndPromPrecie = function() {
        var students = 0;
        var promPrecie = 0;
        for (const course of courseList) {
            students = students + parseInt(course.vacancies);
            promPrecie = promPrecie + parseInt(course.price);
        }
        promPrecie = promPrecie / courseList.length;
        $(STUDENTS_ID).val(students);
        $(PRECIE_ID).val(promPrecie);
    }

    /* Eliminar un item de la tabla y de la base  */
    var deleteValue = function(Id) {
        firebase.database().ref(`cursos/${Id}/`).remove()
        .then(function() {
            showModalElement("Cursos", "Curso borrado correctamente", false);
            courseList.forEach(function(course, index, object) {
                if (parseInt(course.id) === Id) {
                    object.splice(index, 1);
                }
            });
            loadTable();
        }).catch(function(error) {
            showModalElement("Cursos", "Se detecto un error", false);
        });;
    }

    /* LogOut sesion */
    var logout = function(){
        firebase.auth().signOut().then(() => {
            showModalElement("Cursos", "Cierre de sesion", false);
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