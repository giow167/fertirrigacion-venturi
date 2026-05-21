# Sistema de Fertirrigación mediante Inyector Venturi

Presentación web para exposición universitaria.

- **Universidad:** Universidad Autónoma Chapingo (UACh)
- **Departamento:** Irrigación
- **Materia:** Termodinámica
- **Tema:** Diseño, simulación CFD y aplicación de inyectores Venturi en fertirrigación

## Estructura del proyecto

```
claud_/
├── index.html        Marcado principal (12 secciones tipo slides)
├── styles.css        Estilos: tipografía, paleta verde/azul, layout responsivo
├── script.js         Animaciones de scroll, navegación, campos editables
├── README.md         Este archivo
└── assets/
    ├── logos/
    │   ├── uach-logo.png        Logo Universidad Autónoma Chapingo
    │   └── dirh-logo.jpg        Logo Departamento de Irrigación
    └── images/
        ├── fertirrigacion.jpg
        ├── venturi-funcionamiento.jpg
        ├── venturi-diagrama.webp
        ├── cfd-simulation.jpg
        └── riego-agricola.jpg
```

## Secciones de la presentación

1. Portada (logos, título, integrantes editables, profesor, fecha)
2. Introducción — qué es la fertirrigación
3. Problema — dosificación bajo restricciones reales
4. Objetivos — general y específicos
5. Marco teórico — Bernoulli, Venturi, presión–velocidad
6. Funcionamiento — entrada → garganta → succión → mezcla → salida
7. Diseño del inyector — anatomía, geometría, tabla de ángulos
8. Simulación CFD — qué se simula, resultados clave
9. Cálculos — ecuación del caudal con formato matemático
10. Instalación — serie, paralelo, by-pass + tramos rectos
11. Aplicación en fertirrigación — beneficios
12. Resultados y conclusiones
13. Cierre — “Gracias por su atención”

## Cómo ejecutar localmente

El proyecto no tiene dependencias. Solo se necesita un servidor estático (porque las fuentes de Google se cargan vía HTTP).

### Opción 1 — Doble clic
Abre `index.html` directamente en cualquier navegador moderno. Funciona; solo perderás la previsualización de fuentes en algunos navegadores con políticas estrictas.

### Opción 2 — Servidor local con Python (recomendado)
```powershell
cd C:\Users\gvann\Desktop\claud_\proyectos\fertirrigacion-venturi
python -m http.server 8000
```
Luego abre <http://localhost:8000> en el navegador.

### Opción 3 — Servidor local con Node.js
```powershell
cd C:\Users\gvann\Desktop\claud_\proyectos\fertirrigacion-venturi
npx serve .
```

## Uso durante la exposición

- **Modo proyección:** pulsa `F11` en el navegador para pantalla completa.
- **Navegación con teclado:**
  - `↓ / → / Espacio / PageDown` → siguiente sección
  - `↑ / ← / PageUp` → sección anterior
  - `Home` → portada
  - `End` → cierre
- **Índice flotante** a la derecha: los puntos resaltan la sección visible.
- **Barra de progreso** superior: indica cuánto se ha avanzado en la presentación.
- **Campos editables** en la portada (profesor, fecha, integrantes):
  - Haz clic sobre el texto y escribe.
  - Lo escrito se guarda en `localStorage`, así no se pierde al recargar.
  - Para limpiar un campo: bórralo y haz clic afuera (vuelve al placeholder).

## Personalización rápida

| Qué cambiar | Dónde |
| --- | --- |
| Integrantes / profesor / fecha | Editables en pantalla (portada) |
| Paleta de colores | Tokens `--green-*` y `--blue-*` en `:root` de `styles.css` |
| Logos | Reemplazar archivos en `assets/logos/` |
| Imágenes | Reemplazar archivos en `assets/images/` |
| Contenido de cada sección | Editar `index.html` directamente |

## Notas técnicas

- HTML5 semántico (un `<section>` por slide).
- CSS con custom properties, `clamp()` para tipografía fluida y media queries para responsive + impresión.
- Animaciones con `IntersectionObserver` (rendimiento) y soporte de `prefers-reduced-motion`.
- Sin frameworks, sin bundler, sin build step.
- Optimizado para pantallas grandes (`@media (min-width: 1600px)`).

## Fuente del contenido

Todo el material técnico está basado en el documento *Informe Técnico Integral: Diseño, Simulación y Aplicaciones de Inyectores Venturi*.
