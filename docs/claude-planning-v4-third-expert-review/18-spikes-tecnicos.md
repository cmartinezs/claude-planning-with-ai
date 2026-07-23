# Spikes técnicos

## Spike 1 — Plugin real

```text
manifest
-> namespaced skill
-> bin launcher
-> runtime
-> Windows/WSL2/Linux
```

Validar:

- slash command real;
- namespace;
- plugin root;
- PATH;
- Node ausente;
- binario colisionado;
- actualización.

## Spike 2 — Dos worktrees

Simultáneamente:

- crear Release Items;
- crear Work Packages;
- crear eventos;
- tocar una misma release;
- fusionar branches.

Criterio:

- sin conflictos de paths;
- sin pérdida de items;
- índices regenerables;
- IDs resolubles;
- display IDs reconciliados.

## Spike 3 — Crash recovery

Fallar:

1. después de staging;
2. después del primer write;
3. después del canonical state;
4. antes del evento;
5. después de comando externo.

Validar:

- rollback;
- compensación;
- retry;
- idempotencia;
- limpieza.

## Spike 4 — Canonical hashes

Dos YAML equivalentes deben producir el mismo hash pese a:

- orden;
- indentación;
- line endings;
- comentarios;
- estilos de string.

## Spike 5 — Guía ejecutable

Atomizar un Work Package sin:

- interpretar lenguaje natural;
- invocar LLM;
- leer Markdown.

## Criterio de salida

El Corte -1.1 se cierra solo si los cinco spikes producen:

- decisiones explícitas;
- contratos verificables;
- fixtures;
- pruebas automatizadas;
- documentación actualizada.
