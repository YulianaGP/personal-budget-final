
//--------------------------------------------
// 1. DATOS GLOBALES
//--------------------------------------------
        
const movimientos = [];
let filtroTipo = `todos`;
let filtroCategoria = null; // 🆕 nuevo filtro para categoría

    // Programación Imperativa y Manipulación del DOM con algunos elementos de Programación Funcional
const tipoSelect = document.getElementById('tipo');
const categoriaSelect = document.getElementById('categoria');
    // Opciones disponibles
const categoriasPorTipo = {
    ingreso: ['Salario', 'Propina', 'Trabajos extras'],
    egreso: ['Comida', 'Transporte', 'Pago de préstamo', 'Ocio', 'Alquiler']
};

//--------------------------------------------
// 1. CLASES Y HERENCIA (POO)
//--------------------------------------------

class Movimiento {
    constructor(nombre, monto, tipo) {
        this.nombre = nombre;
        this.monto = monto;
        this.tipo = tipo;
        this.fecha = new Date().toLocaleDateString();
    }

    // ✅ Método para validar que el movimiento es correcto
    esValido() { 
        return this.nombre.trim() !== '' && this.monto > 0; //revisa si el nombre no está vacío y si el monto es mayor a 0
    }

    // ✅ Método para mostrar el monto con signo (+ & -) y formato (muestra dos decimales en valor monetario)
    obtenerMontoFormateado() {
        const signo = this.tipo === 'ingreso' ? '+' : '-';
        return `${signo} $${this.monto.toFixed(2)}`;
    }
}

// Programación Orientada a Objetos (POO) - usando el pilar Herencia (forma moderna: con class y extends "ES6")
class Ingreso extends Movimiento {  //Ojo: Ingreso es una función constructora, no una clase
    constructor(nombre, monto) {
        super(nombre, monto, 'ingreso');
    }
}
        
class Egreso extends Movimiento {
    constructor(nombre, monto) {
        super(nombre,  monto, 'egreso')
    }
}

//--------------------------------------------
// 3. FUNCIONES FUNCIONALES
//--------------------------------------------

// Vamos a sumar ingresos, egresos y calcular el balance (Programación funcional)
function recalcularTotales() {
    const totalIngresos = movimientos
        .filter(m => m.tipo === 'ingreso') //solo nos quedamos con los objetos de tipo ingreso
        .reduce((sum, m) => sum + m.monto, 0); // Vamos sumando los montos de ingresos

    const totalEgresos = movimientos
        .filter(m => m.tipo === 'egreso') 
        .reduce((sum, m) => sum + m.monto, 0); // sum comienza en 0, m es cada ingreso filtrado, sum + m.monto va acumulando los valores

    const balance = totalIngresos - totalEgresos;
        
    // Manipulación del DOM 
    document.getElementById('balance-total').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('total-ingresos').textContent = `$${totalIngresos.toFixed(2)}`;
    document.getElementById('total-egresos').textContent = `$${totalEgresos.toFixed(2)}`;
}

//--------------------------------------------
// 4. FUNCIONES DOM $ IMPERATIVAS
//--------------------------------------------

// ✅ Función para actualizar las opciones del select #categoria
function actualizarCategorias() {
    const tipoSeleccionado = tipoSelect.value;
    const categorias = categoriasPorTipo[tipoSeleccionado];

    // Limpiar opciones previas
    categoriaSelect.innerHTML = '';

    // ✅ Agregar opción por defecto
    const opcionInicial = document.createElement('option');
    opcionInicial.value = '';
    opcionInicial.textContent = 'Selecciona categoría';
    opcionInicial.disabled = true;
    opcionInicial.selected = true;
    categoriaSelect.appendChild(opcionInicial);

    // Agregar nuevas opciones
    categorias.forEach(cat => {
        const opcion = document.createElement('option');
        opcion.value = cat;
        opcion.textContent = cat;
        categoriaSelect.appendChild(opcion);
    });
}

// ✅ Función para actualizar la tabla de movimientos
function actualizarTabla() {
    const cuerpoTabla = document.getElementById("tabla-movimientos");
    cuerpoTabla.innerHTML = "";

    // Filtrar según el tipo seleccionado
    let movimientosFiltrados = movimientos;

    if (filtroTipo === "ingreso") {
        movimientosFiltrados = movimientos.filter(m => m.tipo === "ingreso");
    } else if (filtroTipo === "egreso") {
        movimientosFiltrados = movimientos.filter(m => m.tipo === "egreso");
    }
    if (filtroCategoria) {
        movimientosFiltrados = movimientosFiltrados.filter(m => m.categoria === filtroCategoria);
    }

    // Crear filas para cada movimiento
    movimientosFiltrados.forEach((mov, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="border px-4 py-2">${mov.fecha}</td>
            <td class="border px-4 py-2">${mov.nombre}</td>
            <td class="border px-4 py-2">${mov.categoria || '-'}</td> 
            <td class="border px-4 py-2">$${mov.monto.toFixed(2)}</td>
            <td class="border px-4 py-2">${mov.tipo}</td>
            <td class="border px-4 py-2">
                <button onclick="eliminarMovimiento(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

// ✅ Función para mostrar un mensaje flotante
function mostrarMensaje(texto) {
    const mensaje = document.createElement('div');
    mensaje.textContent = texto;
    mensaje.className = 'fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow z-50';
    document.body.appendChild(mensaje);

    setTimeout(() => {
    mensaje.remove();
    }, 2000);
}

//--------------------------------------------
// 5. FUNCIONES DE EVENTOS
//--------------------------------------------

// Programación Orientada a Objetos & Programación Imperativa
function agregarMovimiento(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;

    let nuevoMovimiento;
    if (tipo === 'ingreso') {
        nuevoMovimiento = new Ingreso(nombre, monto);
    } else {
        nuevoMovimiento = new Egreso(nombre, monto);
    }

    nuevoMovimiento.categoria = categoria; // 👈 Agregamos la categoría al objeto

    if (!nuevoMovimiento.esValido()) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    movimientos.push(nuevoMovimiento);
    actualizarTabla();
    recalcularTotales();
    document.getElementById('formulario').reset();
    mostrarMensaje('Movimiento agregado correctamente');
    actualizarCategorias(); 
}

// ✅ Función para eliminar un movimiento
function eliminarMovimiento(index) {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este movimiento?");
    if (!confirmar) return;

    movimientos.splice(index, 1);
    actualizarTabla();
    recalcularTotales();
}

//--------------------------------------------
// 6. FILTRAR POR CATEGORÍA (🆕 NUEVO)
//--------------------------------------------

const thCategoria = document.getElementById("th-categoria");
const menuCategorias = document.createElement("div");
menuCategorias.className = "absolute bg-white border mt-2 shadow-md rounded z-10 hidden";
menuCategorias.style.minWidth = "150px";
thCategoria.appendChild(menuCategorias);

thCategoria.addEventListener("click", () => {
    const categoriasUnicas = [...new Set(movimientos.map(m => m.categoria).filter(Boolean))];
    menuCategorias.innerHTML = "";

    categoriasUnicas.forEach(cat => {
        const opcion = document.createElement("div");
        opcion.textContent = cat;
        opcion.className = "px-4 py-2 hover:bg-gray-200 cursor-pointer";
        opcion.addEventListener("click", () => {
            filtroCategoria = cat;
            actualizarTabla();
            menuCategorias.classList.add("hidden");
        });
        menuCategorias.appendChild(opcion);
    });

    const opcionTodos = document.createElement("div");
    opcionTodos.textContent = "Mostrar todos";
    opcionTodos.className = "px-4 py-2 hover:bg-gray-200 cursor-pointer font-semibold text-blue-600";
    opcionTodos.addEventListener("click", () => {
        filtroCategoria = null;
        actualizarTabla();
        menuCategorias.classList.add("hidden");
    });
    menuCategorias.appendChild(opcionTodos);

    menuCategorias.classList.toggle("hidden");
});

document.addEventListener("click", function (event) {
    if (!thCategoria.contains(event.target)) {
        menuCategorias.classList.add("hidden");
    }
});

//--------------------------------------------
// 7. INICIALIZACIÓN
//--------------------------------------------
document.getElementById('formulario').addEventListener('submit', agregarMovimiento);
    tipoSelect.addEventListener('change', actualizarCategorias);

document.getElementById("filtro-ingresos").addEventListener("click", () => {
    filtroTipo = "ingreso";
    actualizarTabla();
});

document.getElementById("filtro-egresos").addEventListener("click", () => {
    filtroTipo = "egreso";
    actualizarTabla();
});

document.getElementById("filtro-todos").addEventListener("click", () => {
    filtroTipo = "todos";
    actualizarTabla();
});

actualizarCategorias(); //cargar opciones al inicio