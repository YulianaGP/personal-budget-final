# 💰 Gestor de Presupuesto Personal

Este proyecto es una aplicación web que permite registrar ingresos y egresos, calcular el balance actual y filtrar movimientos por tipo y categoría. Está desarrollada con HTML, Tailwind CSS y JavaScript, aplicando diferentes paradigmas de programación: imperativo, funcional, orientado a objetos y prototipal.

---

## 🧠 Paradigmas de Programación Aplicados

- **Imperativo**: se usa para controlar el flujo de ejecución y manipular directamente el DOM.
- **Funcional**: se emplean funciones puras, `map()`, `filter()`, `reduce()` y `find()` para transformar y filtrar datos de movimientos.
- **Orientado a Objetos**: uso de funciones constructoras como `Movimiento`, encapsulando propiedades y métodos asociados.
- **Prototipal**: implementación de herencia entre constructores `Ingreso` y `Egreso`, utilizando `__proto__` y `prototype` para extender comportamientos y atributos.

---

## ⚙️ Tecnologías Utilizadas

- HTML5
- Tailwind CSS
- JavaScript (ES6+)
- Paradigmas: Imperativo, Funcional, Orientado a Objetos, Prototipal

---

## 🧪 Funcionalidades Clave

- Registro de movimientos con nombre, monto y tipo (ingreso/egreso)
- Cálculo automático del balance total
- Historial en tabla con columnas completas (fecha, nombre, monto, tipo, acciones)
- Filtros por tipo y por categoría
- Validaciones visuales de campos
- Eliminación de movimientos
- Diseño responsive con Tailwind CSS

## 📁 Estructura del Código

- `index.html` → Contiene la estructura de la interfaz de usuario (formulario, tabla, balance)
- `script.js` → Contiene toda la lógica funcional, orientada a objetos y prototipal
- `tailwind.config.js` *(opcional)* → Configuración de estilos si se personalizó Tailwind

---

## Historia de Usuario 1: 

Como usuario, quiero registrar un ingreso o egreso con sus detalles, para que el sistema calcule mi balance financiero correctamente.

### ✅ ¿Por qué lo hicimos?
Para que el usuario pueda ingresar sus gastos o ingresos de forma estructurada y segura, validando que la información sea correcta antes de guardarla. Esto garantiza integridad de datos.

### ⚙️ ¿Cómo lo hicimos?
- Creamos una **clase base `Movimiento`** con propiedades comunes (`nombre`, `monto`, `tipo`, `fecha`) y métodos útiles (`esValido()`, `obtenerMontoFormateado()`).
- Luego, usamos **herencia con `class Ingreso` y `class Egreso`** para diferenciar entre tipos de movimientos.
- El formulario HTML se conecta a la función `agregarMovimiento()` que crea instancias usando `new Ingreso(...)` o `new Egreso(...)`, validando con `esValido()`.

```js
class Movimiento {
  constructor(nombre, monto, tipo) {
    this.nombre = nombre;
    this.monto = monto;
    this.tipo = tipo;
    this.fecha = new Date().toLocaleDateString();
  }

  esValido() {
    return this.nombre.trim() !== '' && this.monto > 0;
  }
}

class Ingreso extends Movimiento {
  constructor(nombre, monto) {
    super(nombre, monto, 'ingreso');
  }
}
```

## 🧠 ¿Qué paradigma usamos?

### Programación Orientada a Objetos (POO)

- **Abstracción**: `Movimiento` representa un concepto general que puede ser ingreso o egreso.
- **Herencia**: `Ingreso` y `Egreso` heredan de `Movimiento`, compartiendo propiedades y comportamientos comunes.
- **Encapsulamiento**: La validación y el formato de los datos están contenidos dentro de los objetos, ocultando detalles internos y exponiendo solo lo necesario.

---

## 🌟 Valor agregado

- Reutilizamos código y aplicamos **herencia** para evitar duplicación.
- **Validamos los datos** antes de agregarlos al sistema.
- Se respeta el principio **DRY** (_Don't Repeat Yourself_), haciendo el código más limpio y mantenible.


---

### 🧾 Historia de Usuario 2: Calcular balance automáticamente con `filter()` y `reduce()`

```markdown
## Historia de Usuario 2: Como usuario, quiero que el balance total, los ingresos y egresos se calculen automáticamente cada vez que agrego o elimino un movimiento.

### ✅ ¿Por qué lo hicimos?
Para brindar retroalimentación inmediata al usuario sobre su situación financiera actual y facilitar el control de sus finanzas personales.

### ⚙️ ¿Cómo lo hicimos?
Creamos una función `recalcularTotales()` que:
1. Usa `.filter()` para separar ingresos y egresos.
2. Usa `.reduce()` para sumar los montos de cada tipo.
3. Actualiza el DOM para mostrar los resultados en tiempo real.

```js
function recalcularTotales() {
  const totalIngresos = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const totalEgresos = movimientos
    .filter(m => m.tipo === 'egreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const balance = totalIngresos - totalEgresos;

  document.getElementById('balance-total').textContent = `$${balance.toFixed(2)}`;
}
```

## 🧠 ¿Qué paradigma usamos?

### Programación funcional

- `.filter()` para seleccionar elementos según una condición.
- `.reduce()` para agregarlos en una sola salida, como la sumatoria total.
- En combinación con el paradigma **imperativo** para la manipulación del DOM.

---

## 🌟 Valor agregado

- El **cálculo es automático y en tiempo real**.
- El código es **legible y expresivo** gracias al uso de métodos funcionales.
- **No se requieren bucles `for` ni variables intermedias**, lo que simplifica la lógica.


---

### 🧾 Historia de Usuario 3: Mostrar historial dinámico con prototipos y filtro visual

```markdown
## Historia de Usuario 3: Como usuario, quiero ver todos mis movimientos en una tabla dinámica y poder filtrarlos por tipo o categoría.

### ✅ ¿Por qué lo hicimos?
Porque el usuario necesita una forma clara de visualizar su historial financiero y filtrar según sus necesidades, como ver solo egresos o una categoría específica.

### ⚙️ ¿Cómo lo hicimos?
- Creamos la función `actualizarTabla()` que recorre el arreglo `movimientos` y genera las filas de la tabla.
- Usamos `.filter()` si el usuario selecciona tipo o categoría.
- Los datos se extraen de objetos que usan **herencia prototipal**.
- Cada objeto hereda de `Movimiento`, lo cual se puede comprobar con `obj.__proto__ === Movimiento.prototype`.

```js
function actualizarTabla() {
  let movimientosFiltrados = movimientos;

  if (filtroTipo === "ingreso") {
    movimientosFiltrados = movimientos.filter(m => m.tipo === "ingreso");
  }

  if (filtroCategoria) {
    movimientosFiltrados = movimientosFiltrados.filter(m => m.categoria === filtroCategoria);
  }

  movimientosFiltrados.forEach((mov, index) => {
    // crear fila con mov.fecha, mov.nombre, etc.
  });
}
```

## 🧠 ¿Qué paradigma usamos?

### Prototipos y Programación Orientada a Objetos (POO)

- Los objetos creados heredan de `Movimiento.prototype`.
- Se aprovecha la **cadena de prototipos** para reutilizar métodos.

### Funcional

- Uso de `.filter()` para aplicar criterios de selección sobre los datos.

### Imperativo

- Manipulación del **DOM** para actualizar la tabla de manera manual.

---

## 🌟 Valor agregado

- **Vista personalizada y flexible** adaptada al usuario.
- **Alta reutilización de lógica** gracias a la herencia prototipal.
- **Escalable**, permitiendo agregar más filtros o funcionalidades fácilmente.
