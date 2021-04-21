var dataList = [];
var teacherList = [];

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
        for (const teacher of teacherList) {
            if (parseInt(teacher.id) > id) {
                id = teacher.id;
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
    var BTN_HIDE_SHOW_FORM = '#BtnHideShowForm';
    var BTN_SUCCESS = '#saveButton';
    var BTN_CANCEL = '#cancelButton';
    var TABLE_ID = '#TeachersTable';
    var CONTAINER = '#Container';
    var ADD_TEACHER = 'AGREGAR +';
    var HIDE_FORM = 'OCULTAR -';
    var teacherIdToEdit = "";
    var GET_TEACHERS_URL = 'https://raw.githubusercontent.com/fcrivelli/InstitutoNoterix/newCourses/Profesores';
    var table;

    $(document).ready(function() {
        init();
    });

    /* Inicializo mi pantalla */
    var init = function() {
        initForm();
        initTable();
    };

    /* Formulario */
    /* Inicializo Formulario y botones de formulario */
    var initForm = function() {
        showAndHideForm('none', 'block', ADD_TEACHER);
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
            showAndHideForm('none', 'block', ADD_TEACHER);
        } else {
            showAndHideForm('block', 'block', HIDE_FORM);
        }
    }

    /* Validacion Formulario */
    var validateForm = function() {
        if ($(NAME_TEACHER_ID)[0].value.length == 0) {
            alert('Necesitas completar el Nombre');
            return false;
        }
        if ($(LAST_NAME_TEACHER_ID)[0].value.length == 0) {
            alert('Necesitas completar el Apellido');
            return false;
        }
        if ($(DEGREE_ID)[0].value.length == 0) {
            alert('Necesitas completar el Titulo');
            return false;
        }
        if ($(AGE_ID)[0].value.length == 0) {
            alert('Necesitas completar la edad');
            return false;
        }
        if ($(NAME_COURSE_ID)[0].value.length == 0) {
            alert('Necesitas completar nombre curso');
            return false;
        }
        if ($(EMAIL_ID)[0].value.length == 0 || $(EMAIL_ID).val().indexOf('@', 0) == -1 || $(EMAIL_ID).val().indexOf('.', 0) == -1) {
            alert('Necesitas completar email o es incorrecto');
            return false;
        }
        if ($(DNI_ID)[0].value.length == 0 || $(DNI_ID)[0].value.length < 6) {
            alert('Necesitas completar dni');
            return false;
        }
        return true;
    }

    /* Logica del boton cancel del formulario */
    var cancelCourse = function() {
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
        setValueSelected($(NAME_COURSE_ID)[0], teacher.nameCourse);
        $(EMAIL_ID).val(teacher.email);
        $(DNI_ID).val(teacher.dni);
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
                url: GET_TEACHERS_URL,
                success: function(data) {
                    $(TABLE_ID).dataTable().fnClearTable();
                    if (data.data.length > 0) {
                        $(TABLE_ID).dataTable().fnAddData(data.data);
                        addTeachersToList(data.data);
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
    var addTeachersToList = function(data) {
        for (const row of data) {
            teacherList.push(row);
        }
    }

    /* Guardo el curso cargado, creando una nueva instancia */
    var saveCourse = function() {
        if (teacherIdToEdit === "") { //Nuevo curso
            teacherList.push(new Teacher(
                null,
                $(NAME_TEACHER_ID).val(),
                $(LAST_NAME_TEACHER_ID).val(),
                $(DEGREE_ID).val(),
                $(AGE_ID).val(),
                getValueSelected($(NAME_COURSE_ID)[0]),
                $(EMAIL_ID).val(),
                $(DNI_ID).val(),
            ));
        } else { // Edicion Curso
            var teacherToEdit = teacherList.find(teacher => teacher.id === teacherIdToEdit);
            teacherToEdit.name = $(NAME_TEACHER_ID).val();
            teacherToEdit.lastName = $(LAST_NAME_TEACHER_ID).val();
            teacherToEdit.degree = $(DEGREE_ID).val();
            teacherToEdit.age = $(AGE_ID).val();
            teacherToEdit.nameCourse = getValueSelected($(NAME_COURSE_ID)[0]);
            teacherToEdit.email = $(EMAIL_ID).val();
            teacherToEdit.dni = $(DNI_ID).val();
            showAndHideForm('none', 'block', ADD_TEACHER);
            teacherIdToEdit = "";
        }
        reloadTable();
        clearFields();
    };

    /* Actualizar tabla */
    var reloadTable = function() {
        $(TABLE_ID).dataTable().fnClearTable();
        $(TABLE_ID).dataTable().fnAddData(teacherList);
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

    /* Eliminar un item de la tabla y de la base  */
    var deleteValue = function(Id) {
        teacherList.forEach(function(teacher, index, object) {
            if (parseInt(teacher.id) === Id) {
                object.splice(index, 1);
            }
        });
        reloadTable();
    }

    return {
        init: init,
        deleteValue: deleteValue,
        showEdit: showEdit
    }

})();