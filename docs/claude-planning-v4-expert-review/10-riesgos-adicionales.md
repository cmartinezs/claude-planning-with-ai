# Riesgos adicionales

## 1. Concurrencia

Deben contemplarse:

- dos agentes operando simultáneamente;
- Git worktrees;
- ramas distintas;
- generación concurrente de IDs;
- modificaciones manuales;
- cambios entre dry-run y apply;
- merges de metadata.

Sin optimistic locking y journal, el determinismo se rompe.

## 2. Seguridad de ejecución

Los custom generators y comandos deben protegerse contra:

- command injection;
- interpolación insegura;
- path traversal;
- symlink escape;
- ejecución fuera del workspace;
- comandos no aprobados;
- exposición de secretos;
- uso indiscriminado de `git` y `gh`.

## 3. IDs estables

No mezclar en el ID:

- identidad;
- orden;
- agrupación;
- scope;
- slug;
- título.

Evitar:

```text
story-01-a-capability-ui
```

Preferir:

```text
S0004-capability-ui
WP0012-api
```

## 4. Gates transversales

Deben ser ciudadanos explícitos:

- seguridad;
- observabilidad;
- migración de datos;
- rollback;
- feature flags;
- compatibilidad;
- performance;
- documentación;
- deployment;
- post-deployment verification;
- monitoring window.

No siempre pertenecen a una única task o scope.

## 5. Provenance

Toda salida generada con IA debe registrar:

```yaml
provenance:
  generator: ai
  model: ...
  prompt_version: ...
  sources: [...]
  source_fingerprints: [...]
  generated_at: ...
  reviewed_by: ...
  approved_at: ...
```

## 6. Reproducibilidad

El plugin debe bloquear o advertir cuando:

- cambia el schema;
- cambia el template pack;
- falta la versión original;
- una guía está stale;
- una release histórica usa configuración incompatible.

## 7. Reglas cross-platform

El runtime debe probarse en:

- Windows;
- WSL2;
- Linux;
- macOS.

Deben evitarse supuestos sobre:

- separadores de rutas;
- bash;
- permisos Unix;
- symlinks;
- case sensitivity;
- codificación;
- line endings.

## 8. Recuperación

Cada operación debe definir:

- rollback técnico;
- rollback lógico;
- reintento;
- compensación;
- estado de operación fallida.

## 9. Observabilidad

Registrar al menos:

- operation ID;
- actor;
- agente;
- modelo;
- duración;
- input hash;
- output hash;
- archivos modificados;
- comandos ejecutados;
- resultado;
- errores;
- aprobación humana.
