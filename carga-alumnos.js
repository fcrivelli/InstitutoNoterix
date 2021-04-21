var dataList = [];
var studentList = [];

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
        this.ocpation = ocupation;
    }

    /* Genero un id unico para cada estudiante */
    uniqueId() {
        let id = 0;
        for (const student of studentList) {
            if (parseInt(student.id) > id) {
                id = student.id;
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
    var BTN_HIDE_SHOW_FORM = '#BtnHideShowForm';
    var BTN_SUCCESS = '#saveButton';
    var BTN_CANCEL = '#cancelButton';
    var TABLE_ID = '#StudentsTable';
    var CONTAINER = '#Container';
    var ADD_STUDENT = 'AGREGAR +';
    var HIDE_FORM = 'OCULTAR -';
    var studentIdToEdit = "";
    var GET_STUDENTS_URL = 'https://raw.githubusercontent.com/fcrivelli/InstitutoNoterix/e32f0b0c3351dc026b4b99155ef7cfa423a124ec/Alumnos';
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
        showAndHideForm('none', 'block', ADD_STUDENT);
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
            showAndHideForm('none', 'block', ADD_STUDENT);
        } else {
            showAndHideForm('block', 'block', HIDE_FORM);
        }
    }

    /* Validacion Formulario */
    var validateForm = function() {
        if ($(NAME_STUDENT_ID)[0].value.length == 0) {
            alert('Necesitas completar el Nombre');
            return false;
        }
        if ($(LAST_NAME_STUDENT_ID)[0].value.length == 0) {
            alert('Necesitas completar el Apellido');
            return false;
        }
        if ($(AGE_ID)[0].value.length == 0) {
            alert('Necesitas completar la edad');
            return false;
        }
        if ($(OCUPATION_ID)[0].value.length == 0) {
            alert('Necesitas completar la ocupacion');
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
        setValueSelected($(NAME_COURSE_ID)[0], student.nameCourse);
        setValueSelected($(OCUPATION_ID)[0], student.ocupation);
        $(EMAIL_ID).val(student.email);
        $(DNI_ID).val(student.dni);
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
                url: GET_STUDENTS_URL,
                success: function(data) {
                    $(TABLE_ID).dataTable().fnClearTable();
                    if (data.data.length > 0) {
                        $(TABLE_ID).dataTable().fnAddData(data.data);
                        addStudentsToList(data.data);
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
    var addStudentsToList = function(data) {
        for (const row of data) {
            studentList.push(row);
        }
    }

    /* Guardo el curso cargado, creando una nueva instancia */
    var saveCourse = function() {
        if (studentIdToEdit === "") { //Nuevo curso
            studentList.push(new Student(
                null,
                $(NAME_STUDENT_ID).val(),
                $(LAST_NAME_STUDENT_ID).val(),
                $(AGE_ID).val(),
                getValueSelected($(NAME_COURSE_ID)[0]),
                $(EMAIL_ID).val(),
                $(DNI_ID).val(),
                getValueSelected($(OCUPATION_ID)[0]),
            ));
        } else { // Edicion Curso
            var studentToEdit = studentList.find(student => student.id === studentIdToEdit);
            studentToEdit.name = $(NAME_STUDENT_ID).val();
            studentToEdit.lastName = $(LAST_NAME_STUDENT_ID).val();
            studentToEdit.age = $(AGE_ID).val();
            studentToEdit.nameCourse = getValueSelected($(NAME_COURSE_ID)[0]);
            studentToEdit.ocupation = getValueSelected($(OCUPATION_ID)[0]);
            studentToEdit.email = $(EMAIL_ID).val();
            studentToEdit.dni = $(DNI_ID).val();
            showAndHideForm('none', 'block', ADD_STUDENT);
            studentIdToEdit = "";
        }
        reloadTable();
        clearFields();
    };

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

    /* Actualizar tabla */
    var reloadTable = function() {
        $(TABLE_ID).dataTable().fnClearTable();
        $(TABLE_ID).dataTable().fnAddData(studentList);
        $(TABLE_ID).dataTable().fnDraw();
    }

    /* Eliminar un item de la tabla y de la base  */
    var deleteValue = function(Id) {
        studentList.forEach(function(student, index, object) {
            if (parseInt(student.id) === Id) {
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