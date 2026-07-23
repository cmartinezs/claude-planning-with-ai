# Revisión experta del rediseño v4

## Propósito

Este paquete documenta la evaluación arquitectónica del cambio de foco propuesto para la versión 4 del plugin `claude-planning-with-ai`.

La revisión analiza exclusivamente la nueva propuesta contenida en:

- Repositorio: `cmartinezs/claude-planning-with-ai`
- Commit: `cd0a0c9c0255034c8918587aae50ce1098815960`
- Ruta: `docs/plugin-redesign-release-flow/`

El diseño anterior del plugin se considera descartable, salvo aquellas capacidades que la propia propuesta v4 decida conservar o reimplementar.

## Tesis principal

La dirección estratégica es correcta: el plugin debe abandonar el crecimiento basado en comandos independientes y convertirse en un runtime de planificación con:

- una superficie pública menor;
- un modelo de dominio explícito;
- operaciones mecánicas deterministas;
- IA limitada al trabajo que requiere juicio;
- aprobaciones humanas en decisiones ambiguas;
- estado trazable, reproducible y auditable.

Sin embargo, el modelo propuesto todavía conserva una deformación conceptual importante: utiliza historias por scope como si fueran User Stories, y luego introduce `Story Group` para reconstruir la capacidad funcional transversal.

La corrección recomendada es:

```text
release -> story/capability -> scope work packages -> tasks
```

## Evaluación general

| Dimensión | Evaluación |
|---|---:|
| Cambio estratégico | 9/10 |
| Reducción de complejidad pública | 8/10 |
| Separación IA/scripts | 8.5/10 |
| Modelo de dominio actual | 6/10 |
| Determinismo real | 5.5/10 |
| Preparación para concurrencia y agentes autónomos | 4.5/10 |

## Orden de lectura

1. [Resumen ejecutivo](01-resumen-ejecutivo.md)
2. [Aspectos positivos](02-lo-bueno.md)
3. [Problemas de diseño](03-lo-malo.md)
4. [Problemas estructurales críticos](04-lo-feo.md)
5. [Modelo de dominio recomendado](05-modelo-dominio-recomendado.md)
6. [Storage recomendado](06-storage-recomendado.md)
7. [Protocolo determinista](07-protocolo-determinista.md)
8. [Estados recomendados](08-estados-recomendados.md)
9. [Superficie pública recomendada](09-superficie-publica.md)
10. [Riesgos adicionales](10-riesgos-adicionales.md)
11. [Recomendación de implementación](11-recomendacion.md)
12. [Próximos pasos](12-proximos-pasos.md)
13. [Conclusión](13-conclusion.md)

## Recomendación de uso

Este paquete puede utilizarse como entrada para:

- corregir la propuesta arquitectónica v4;
- generar un master plan de implementación;
- diseñar los schemas de dominio;
- definir contratos entre skills, scripts y agentes;
- construir fixtures y pruebas de arquitectura;
- planificar la eliminación completa del modelo legacy.
