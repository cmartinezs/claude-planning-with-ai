# Lo bueno

## 1. Release como centro de gravedad

El cambio desde:

```text
planning -> stories -> tasks
release -> plannings
```

hacia:

```text
release -> scopes -> stories -> tasks
```

elimina una entidad mental innecesaria.

El usuario piensa naturalmente en:

- qué se entregará;
- qué capacidades incluye;
- qué componentes afecta;
- qué trabajo falta;
- cuándo puede liberarse.

No piensa primero en crear una planning para después incluirla en una release.

Convertir la release en contrato de entrega permite agregar correctamente:

- alcance;
- Definition of Done;
- dependencias;
- evidencia;
- riesgos;
- readiness;
- release notes;
- retrospectiva.

La release deja de ser un reporte agregado y pasa a ser una unidad operativa.

## 2. Corte limpio de v4

Eliminar aliases, storage paralelo y compatibilidad implícita es una buena decisión.

Una capa de compatibilidad v3 probablemente duplicaría durante años:

- validadores;
- rutas;
- estados;
- documentación;
- scripts;
- casos de prueba;
- reglas de migración.

Para un plugin que todavía está bajo control directo de su autor, este es el momento adecuado para ejecutar una ruptura mayor.

## 3. Separación entre IA y mecánica

Este es uno de los puntos más fuertes de la propuesta.

Los scripts deben encargarse de:

- IDs;
- paths;
- transiciones;
- índices;
- validaciones;
- dependencias;
- reportes;
- generación de estructuras;
- planificación Git.

La IA debe limitarse a:

- interpretar intención;
- descomponer trabajo;
- evaluar trade-offs;
- diseñar;
- implementar;
- revisar evidencia;
- sintetizar decisiones y retrospectivas.

El agente debe entregar una estructura que el script valida y aplica.

No debería editar libremente:

- estados;
- tablas;
- índices;
- rutas;
- relaciones derivables.

## 4. Contrato stage-first y dry-run

La interfaz stage-first es adecuada:

```text
release.mjs <stage>
planning-story.mjs <stage>
planning-task.mjs <stage>
planning-check.mjs <stage>
```

Con salidas Markdown y JSON, el núcleo puede ser consumido por:

- CLI;
- skills;
- agentes;
- CI;
- IDEs;
- automatizaciones;
- pruebas de contrato.

El JSON debe convertirse en el protocolo principal entre el agente y el runtime.

Markdown debe ser una vista humana.

## 5. Guías configurables por scope

Extraer reglas de implementación y testing desde la documentación real del proyecto es una buena respuesta al problema de generalización.

El plugin no debería tener hardcodeado que un scope frontend necesita:

- mockup;
- data provider;
- conexión real;
- E2E.

Estas reglas corresponden al proyecto y al scope.

La propuesta acierta al considerar:

- fuentes documentales;
- fingerprints;
- detección de staleness;
- gaps;
- generadores custom;
- validación de salida;
- fallback explícito.

## 6. Skills delgadas

El contrato propuesto para cada `SKILL.md` es correcto.

Debe incluir:

- propósito;
- argumentos;
- precondiciones;
- invocación del script;
- punto de intervención de IA;
- criterios de stop;
- aprobación humana.

No debe incluir:

- parseo Markdown;
- asignación de IDs;
- lógica de estados;
- pasos Git repetidos;
- tablas duplicadas;
- reglas que ya viven en scripts o templates.

Esto reduce drift y permite probar la lógica sin invocar un LLM.
