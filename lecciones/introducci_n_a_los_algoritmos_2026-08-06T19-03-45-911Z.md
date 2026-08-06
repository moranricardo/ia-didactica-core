¡Hola! Qué alegría tenerte aquí. Como tu tutor pedagógico, te doy la bienvenida a este viaje al fascinante mundo de la tecnología y la resolución de problemas. 

No importa si nunca has escrito una sola línea de código o si te consideras "malo para las matemáticas". Hoy vas a descubrir que **tú ya usas algoritmos todos los días sin darte cuenta**.

Al final de esta lección, entenderás qué es un algoritmo, cómo funciona, cómo diseñar uno y cómo poner a prueba tu pensamiento lógico. ¡Empecemos!

---

# Lección: Introducción a los Algoritmos

## 1. ¿Qué es un Algoritmo? (La definición sencilla)

Imagina que quieres enseñarle a un extraterrestre cómo preparar una taza de té. El extraterrestre no sabe qué es el té, ni el agua caliente, ni cómo usar una taza. Tienes que darle instrucciones **paso a paso, muy claras y en orden**, para que no termine cometiendo un desastre.

Eso es, exactamente, un **algoritmo**.

> **Definición formal:** Un algoritmo es un conjunto organizado, ordenado y finito de pasos o instrucciones que permiten resolver un problema, tomar una decisión o realizar una tarea.

Las computadoras son como ese extraterrestre: son extremadamente rápidas, pero no son "inteligentes" por sí mismas. Necesitan que un humano (un programador) les dé un algoritmo para saber qué hacer.

---

## 2. Las 4 Reglas de Oro de un Algoritmo

Para que un algoritmo sea considerado "bueno", debe cumplir con cuatro características esenciales:

1. **Preciso:** Cada paso debe ser claro y no prestarse a dobles interpretaciones (sin ambigüedades).
2. **Definido (o Determinista):** Si sigues el algoritmo varias veces con los mismos datos de inicio, **siempre** debes obtener el mismo resultado.
3. **Finito:** Debe tener un inicio y un final. No puede durar para siempre.
4. **Tiene Entrada y Salida:** Recibe algo de información al principio (Entrada), trabaja con ella (Proceso) y entrega un resultado (Salida).

---

## 3. ¿Cómo representamos un Algoritmo?

Los humanos usamos principalmente tres formas para diseñar y comunicar algoritmos antes de escribirlos en un lenguaje de programación (como Python o JavaScript):

* **A. Lenguaje Natural:** Explicar el proceso en nuestro propio idioma (español, inglés, etc.).
* **B. Pseudocódigo:** Un lenguaje "intermedio". Es más ordenado que el lenguaje natural y se parece a la programación, pero se escribe en español y es fácil de leer.
* **C. Diagrama de Flujo:** Una representación gráfica que usa cajitas y flechas para mostrar el camino que siguen las instrucciones.

---

## 4. Ejemplos Prácticos

¡Vamos a la práctica! Veremos dos ejemplos: uno de la vida cotidiana y otro con un toque más matemático/computacional.

### Ejemplo 1: El algoritmo para "Cruzar la calle" (Vida cotidiana)

Este algoritmo en lenguaje natural muestra cómo tomamos decisiones lógicas constantemente:

* **Inicio**
1. Llegar a la esquina de la calle.
2. Mirar hacia la izquierda y hacia la derecha.
3. **Preguntar:** ¿Viene algún vehículo?
   * *Si la respuesta es SÍ:* Esperar a que pase y volver al paso 2.
   * *Si la respuesta es NO:* Cruzar la calle con cuidado.
4. Llegar al otro lado.
* **Fin**

*(¿Ves cómo el paso 3 tiene una bifurcación o decisión? Eso en programación se llama "condicional").*

---

### Ejemplo 2: Encontrar el mayor de dos números (Lógica de computadora)

Imagina que le pides a una computadora que te diga cuál de dos números que tú escribas es el más grande. Aquí está el algoritmo escrito en **Pseudocódigo**:

```text
Inicio Algoritmo_Mayor
    
    // 1. Entrada de datos
    Escribir "Por favor, ingresa el primer número (A):"
    Leer A
    Escribir "Por favor, ingresa el segundo número (B):"
    Leer B
    
    // 2. Proceso (Tomar una decisión)
    Si A es mayor que B Entonces:
        Mostrar "El número mayor es: " + A
    Sino, si B es mayor que A Entonces:
        Mostrar "El número mayor es: " + B
    Sino:
        Mostrar "Ambos números son iguales"
    Fin Si
    
Fin Algoritmo_Mayor
```

---

## Resumen de la Lección
Un algoritmo es la "receta" que le dice a una computadora cómo resolver un problema. Debe ser **preciso, definido y finito**. No necesitas saber programar para pensar de manera algorítmica; solo necesitas aprender a descomponer un problema grande en pasos pequeños y ordenados.

---

## Autoevaluación 📝

¡Es hora de poner a prueba lo aprendido! Responde a las siguientes preguntas para consolidar tus conocimientos. (Las respuestas explicadas están justo abajo, ¡pero no hagas trampa!).

### Pregunta 1:
¿Cuál de las siguientes opciones **NO** es una característica obligatoria de un algoritmo?
* A) Debe tener un número finito de pasos.
* B) Debe estar escrito en un lenguaje de programación complejo.
* C) Debe ser preciso y sin ambigüedades.
* D) Debe producir siempre el mismo resultado ante los mismos datos de entrada.

### Pregunta 2:
Imagina un algoritmo para hacer café. El paso de "servir el café en la taza" corresponde a la etapa de:
* A) Entrada
* B) Proceso
* C) Salida
* D) Bucle infinito

### Pregunta 3:
¿Qué error tiene el siguiente algoritmo para "Apagar una vela"?
1. *Inicio*
2. Soplar la vela.
3. *Fin*

* A) No tiene ningún error.
* B) No es finito.
* C) Le falta precisión (¿Qué pasa si la vela no se apaga al primer soplido?).
* D) Es demasiado largo.

---

### 🔑 Respuestas y Retroalimentación

* **Respuesta a la Pregunta 1:** **B**. Los algoritmos se pueden escribir en papel, en español, con dibujos o con señas. El lenguaje de programación es solo la herramienta final para traducirlos, pero el algoritmo existe de forma independiente al código.
* **Respuesta a la Pregunta 2:** **C (Salida)**. La entrada son los ingredientes (café, agua), el proceso es hervir y colar, y la salida es el producto final servido y listo para disfrutar.
* **Respuesta a la Pregunta 3:** **C**. Le falta precisión y lógica de control. Si soplas despacio y la vela sigue encendida, el algoritmo igual termina (Paso 3). Un buen algoritmo incluiría una pregunta: *"¿Sigue encendida? Si es así, sopla de nuevo"*.

---

¡Felicidades por completar esta lección introductoria! Has dado el primer paso —y el más importante— para convertirte en un gran pensador lógico y, si lo deseas, en un gran programador. 

¿Tienes alguna duda sobre alguno de los puntos que vimos? ¡Estoy aquí para ayudarte!