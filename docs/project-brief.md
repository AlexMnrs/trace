# Project Brief — Spatial File Search

## Idea

Aplicación de escritorio para Linux orientada a buscar y explorar archivos mediante una interfaz visual y espacial inspirada en las pantallas de *Person of Interest*.

Los resultados no se presentan como una lista tradicional, sino como elementos distribuidos por la pantalla. Cada archivo tiene una representación visual y los resultados más relevantes reciben mayor protagonismo.

El proyecto se desarrolla principalmente **for fun y como proyecto de aprendizaje**. No pretende competir con otros buscadores ni ser necesariamente mejor que ellos.

## Objetivo

Permitir al usuario encontrar archivos rápidamente mientras la búsqueda se siente visual, dinámica y cercana a una interfaz de ciencia ficción.

La aplicación debe combinar dos objetivos:

- **Funcional:** encontrar archivos fácilmente.
- **Experiencia:** hacer que explorar los resultados sea visualmente interesante y espacial.

## Experiencia principal

1. El usuario abre la aplicación.
2. Empieza a escribir una búsqueda.
3. Se obtienen archivos cuyo nombre coincide con el texto.
4. Cada resultado recibe una relevancia según el grado de coincidencia.
5. Los resultados aparecen distribuidos espacialmente por la pantalla.
6. Los resultados más relevantes tienen mayor protagonismo visual.
7. Cada resultado muestra una miniatura cuando sea posible o un icono representativo.
8. Al seleccionar o pasar el cursor sobre un resultado, este aumenta ligeramente de tamaño y muestra información adicional.
9. El usuario puede abrir el archivo o localizarlo en su gestor de archivos.

## Información de cada resultado

Cada resultado necesita, inicialmente:

- nombre;
- ruta/ubicación;
- tipo de archivo;
- tamaño;
- fecha de modificación;
- preview o icono;
- puntuación de relevancia.

## Relevancia

La relevancia depende inicialmente de cuánto coincide el nombre del archivo con la búsqueda.

Por ejemplo:

- coincidencia exacta → relevancia máxima;
- comienza por la búsqueda → muy alta;
- contiene la búsqueda → alta;
- coincidencia parcial → menor.

La relevancia podrá influir en la posición, tamaño o protagonismo visual del resultado.

## Responsabilidades principales

**Búsqueda**  
Obtiene archivos candidatos a partir del texto introducido.

**Ranking**  
Calcula qué resultados son más relevantes.

**Metadatos**  
Obtiene nombre, ruta, tamaño, tipo y fechas del archivo.

**Preview**  
Obtiene una miniatura cuando sea posible o selecciona un icono apropiado.

**Spatial Layout**  
Decide dónde aparece cada resultado y cuánto protagonismo visual recibe.

**Interfaz**  
Renderiza los resultados y gestiona hover, selección y navegación.

**Acciones del sistema**  
Permite abrir un archivo o mostrar su ubicación.

## Flujo principal

Usuario  
→ búsqueda  
→ archivos candidatos  
→ ranking  
→ metadatos/previews  
→ distribución espacial  
→ interfaz  
→ selección/acción

## Fuente de búsqueda inicial

La primera versión puede utilizar un buscador/indexador existente de Linux como backend.

La aplicación debe evitar depender directamente de su implementación desde la interfaz, de forma que en el futuro pueda sustituirse por otro backend o por un índice propio sin rediseñar el resto de la aplicación.

Un índice propio queda como posible evolución futura, no como requisito inicial.

## Decisiones técnicas pendientes

Antes de implementar el proyecto, analizar y comparar entre 2 y 3 opciones razonables para:

- lenguaje de programación;
- framework de interfaz gráfica;
- backend inicial de búsqueda.

Para cada alternativa, explicar en lenguaje accesible:

- ventajas para este proyecto;
- inconvenientes;
- dificultad de desarrollo y mantenimiento;
- calidad y flexibilidad para una interfaz visual con muchas tarjetas, animaciones y previews;
- integración con Linux;
- facilidad de distribución;
- madurez del ecosistema;
- riesgo de que la elección limite futuras ideas del proyecto.

Realizar una recomendación final razonada.

**No inicializar ni implementar el proyecto hasta que estas decisiones técnicas hayan sido revisadas y aceptadas.**

La prioridad no debe ser elegir la tecnología más sofisticada o de moda, sino la que permita construir y experimentar con esta aplicación con una complejidad razonable.

## Alcance de la V1

La primera versión debe demostrar que **la experiencia espacial de búsqueda funciona y resulta divertida de utilizar**.

Incluye:

- búsqueda de archivos por nombre;
- ranking básico;
- resultados espaciales;
- previews de imágenes cuando sea sencillo obtenerlas;
- iconos para otros archivos;
- hover/selección con información;
- abrir archivo;
- mostrar ubicación.

## Fuera de alcance inicialmente

- índice propio;
- búsqueda dentro del contenido de documentos;
- búsqueda semántica o IA;
- OCR;
- previews avanzadas para todos los formatos;
- historial;
- etiquetas;
- sincronización;
- plugins;
- automatizaciones;
- gestión o modificación de archivos.

## Principio del proyecto

**La interfaz espacial es el producto.**

La arquitectura y las decisiones técnicas deben mantenerse suficientemente simples como para poder experimentar rápidamente con posiciones, tamaños, animaciones, relevancia y comportamiento visual sin convertir el proyecto en la construcción de un motor de búsqueda complejo.
