const precieHour = 150;
var dataInt;
var courseList = [];
var firebase;

/* Intento generar un sistema de observers y notificaciones para cargar las listas relacionadas */
class Observable {
    constructor() {
        this.observerList = [];
    }
    add(Observer) {
        this.observerList.push(Observer)
    }
    remove() {

    }
    upsert() {

    }
}
window.observable = new Observable();

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
        for (const course of courseList) {
            if (parseInt(course.id) > id) {
                id = course.id;
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
    var ACTIVE_ID = '#ActiveChb';
    var HOUR_ID = '#HourDp';
    var FORM_INPUT_ID = '#FormInput';
    var BUTTON_SAVE_CANCEL_ID = '#BtnSaveCancel';
    var HIDE_SHOW_FORM = '#HideShowForm';
    var BTN_HIDE_SHOW_FORM = '#BtnHideShowForm';
    var BTN_SUCCESS = '#saveButton';
    var BTN_CANCEL = '#cancelButton';
    var TABLE_ID = '#CoursesTable';
    var CONTAINER = '#Container';
    var ADD_COURSE = 'AGREGAR +';
    var HIDE_FORM = 'OCULTAR -';
    var courseIdToEdit = "";
    var GET_DATA_FIREBASE_URL = 'https://institutonoterix-default-rtdb.firebaseio.com/.json';
    var table;
    var refCources;

    $(document).ready(function() {
        init();
    });

    /* Inicializo mi pantalla */
    var init = function() {
        initFirebase();
        initForm();
        initTable();
    };

    /* Inicializo Firebase */
    var initFirebase = function() {
        firebase = require('firebase/app');
        require('firebase/auth');
        require('firebase/database');
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        var firebaseConfig = {
            apiKey: "AIzaSyBMWlxH-4dlOlXhqCq6VMgu4ZWchaw1f7c",
            authDomain: "institutonoterix.firebaseapp.com",
            databaseURL: "https://institutonoterix-default-rtdb.firebaseio.com",
            //    projectId: "institutonoterix",
            storageBucket: "institutonoterix.appspot.com",
            //    messagingSenderId: "638778265851",
            //     appId: "1:638778265851:web:4a3b43d4bd0d461743205e",
            //    measurementId: "G-YYR5S8WP87"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        var database = firebase.database();
    }

    /* Formulario */
    /* Inicializo Formulario y botones de formulario */
    var initForm = function() {
        showAndHideForm('none', 'block', ADD_COURSE);
        $(BTN_HIDE_SHOW_FORM).on('click', function() {
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
    }

    /* Muestro y Oculto el formulario */
    var showAndHideForm = function(showForm, showBtn, txtBtn) {
        $(FORM_INPUT_ID)[0].style.display = showForm;
        $(BUTTON_SAVE_CANCEL_ID)[0].style.display = showForm;
        $(HIDE_SHOW_FORM)[0].style.display = showBtn;
        $(BTN_HIDE_SHOW_FORM)[0].innerText = txtBtn;
    }

    /* Logica para mostrar y ocultar el formulario  */
    var btnHideShowForm = function() {
        if ($(FORM_INPUT_ID)[0].style.display === 'block') {
            showAndHideForm('none', 'block', ADD_COURSE);
        } else {
            showAndHideForm('block', 'block', HIDE_FORM);
        }
    }

    /* Validacion Formulario */
    var validateForm = function() {
        if ($(COURSE_ID)[0].value.length == 0) {
            alert('Necesitas completar el Nombre del Curso');
            return false;
        }
        if ($(MAIN_TEACHER_ID)[0].value.length == 0) {
            alert('Necesitas completar el Nombre del Profesor');
            return false;
        }
        if ($(SECOND_TEACHER_ID)[0].value.length == 0) {
            alert('Necesitas completar el Nombre del Ayudante');
            return false;
        }
        if ($(TYPE_ID)[0].value.length == 0) {
            alert('Necesitas completar el Tipo');
            return false;
        }
        if ($(HOUR_ID)[0].value.length == 0) {
            alert('Necesitas completar el Horas Curso');
            return false;
        }
        if ($(DATE_ID)[0].value.length == 0) {
            alert('Necesitas completar Fecha');
            return false;
        }
        if ($(AMOUNT_VACANCIES_ID)[0].value.length == 0) {
            alert('Necesitas completar Cupos');
            return false;
        }
        if ($(AMOUNT_DAYS_ID)[0].value.length == 0) {
            alert('Necesitas completar dias');
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
        $(ACTIVE_ID).removeAttr('checked');
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
        $(ACTIVE_ID).removeAttr('checked');
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
                    dataInt = data;
                    $(TABLE_ID).dataTable().fnClearTable();
                    if (data.cursos.length > 0) {
                        $(TABLE_ID).dataTable().fnAddData(data.cursos);
                        addCoursesToList(data.cursos);
                    } else {
                        $(TABLE_ID).dataTable().fnDraw();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert("Error en el pedido de cursos.");
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
        for (const row of data) {
            courseList.push(row);
        }
        calculateStudentsAndPromPrecie();
    }

    /* Guardo el curso cargado, creando una nueva instancia */
    var saveCourse = function() {
        if (courseIdToEdit === "") { //Nuevo curso
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
            refCources = firebase.database().ref('cursos');
            refCources.set(newCourse).then(function() {
                console.log('dato almacenado correctamente');
            }).catch(function(error) {
                console.log('detectado un error', error);
            });;
        } else { // Edicion Curso
            var courseToEdit = courseList.find(course => course.id === courseIdToEdit);
            courseToEdit.name = $(COURSE_ID).val();
            courseToEdit.hoursTime = $(HOUR_ID).val();
            courseToEdit.daysTime = $(AMOUNT_DAYS_ID).val();
            courseToEdit.mainTeacher = getValueSelected($(MAIN_TEACHER_ID)[0]);
            courseToEdit.secondTeacher = getValueSelected($(SECOND_TEACHER_ID)[0]);
            courseToEdit.date = $(DATE_ID).val();
            courseToEdit.type = getValueSelected($(TYPE_ID)[0]);
            courseToEdit.vacancies = $(AMOUNT_VACANCIES_ID).val();
            refCources = firebase.database().ref('cursos').child(courseToEdit.id);
            refCources.update(courseToEdit);
            showAndHideForm('none', 'block', ADD_COURSE);
            courseIdToEdit = "";
        }
        postData();
        reloadTable();
        calculateStudentsAndPromPrecie();
        clearFields();
    };

    /* Actualizar Base de datos Firebase */
    var postData = function() {
        dataInt.cursos = courseList;
        $.ajax({
            url: GET_DATA_FIREBASE_URL,
            type: "POST",
            data: JSON.stringify(dataInt),
            success: function() {
                alert("success");
            },
            error: function(error) {
                alert("error: " + error);
            }
        });
    }

    /* Actualizar tabla */
    var reloadTable = function() {
        $(TABLE_ID).dataTable().fnClearTable();
        $(TABLE_ID).dataTable().fnAddData(courseList);
        $(TABLE_ID).dataTable().fnDraw();
    }

    /* Uso esta funcion ya que la lista desplegable guarda el valor de la opcion no el contenido */
    var setValueSelected = function(select, text) {
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].text === text) {
                return i + 1;
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
        courseList.forEach(function(course, index, object) {
            if (parseInt(course.id) === Id) {
                object.splice(index, 1);
            }
        });
        calculateStudentsAndPromPrecie();
        reloadTable();
    }

    return {
        init: init,
        deleteValue: deleteValue,
        showEdit: showEdit
    }

})();