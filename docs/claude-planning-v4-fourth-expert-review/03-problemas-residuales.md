# Problemas residuales

## 1. Los spikes están documentados, no ejecutados

El Corte -1.2 describe correctamente:

- hipótesis;
- áreas de riesgo;
- criterios generales;
- bloqueadores.

Pero todavía no existen:

- prototipos;
- resultados;
- fixtures implementados;
- pruebas automatizadas;
- ADRs;
- evidencia cross-platform;
- decisiones finales.

## 2. El manifest sigue siendo v3

El manifest actual todavía declara:

```json
{
  "name": "claude-planning-with-ai",
  "version": "3.11.0"
}
```

Y describe un sistema Markdown-first.

Esto es coherente con el estado real del repo, pero confirma que el nuevo producto todavía no está implementado.

## 3. El roadmap tiene drift

Un documento exige cerrar el Corte -1.2 antes del vertical slice.

Otro todavía dice que el vertical slice puede comenzar después de Corte -1 y -1.1.

## 4. El producto todavía no está decidido

La documentación mantiene simultáneamente:

```text
v4.0.0 del plugin existente
```

y:

```text
producto nuevo 1.0.0
```

## 5. Launcher interno versus CLI pública

`bin/<product-cli>` es visible para el Bash tool del plugin.

Eso no implica que esté instalado globalmente para el usuario o CI.

## 6. Falta contrato de permisos de skills

No está definido qué skills pueden preaprobar:

- Bash;
- check;
- propose;
- validate;
- apply;
- approve;
- Git;
- deployment.

## 7. Agregados ambiguos

El modelo se llama Release Aggregate, pero Release Item, Work Package y Task tienen:

- archivos propios;
- revisiones propias;
- operaciones independientes.

## 8. Display IDs no resueltos

Se usan como argumentos humanos, pero no está definido:

- asignación;
- colisión;
- integración;
- aliases;
- reasignación;
- scope del contador.

## 9. DSL incompleta

Existen operadores, pero falta semántica formal.

## 10. Hashing incompleto

Existe pipeline, pero no estándar de canonical JSON ni tree hashing para fuentes.

## 11. Environments mezclados

`local` y `ci` no son el mismo tipo de concepto que `beta`, `demo` y `production`.

## 12. State machine incompleta

Se enumeran estados, pero no transiciones válidas ni semántica de recovery.
