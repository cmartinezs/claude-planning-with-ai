# Protocolo determinista

## Pipeline obligatorio

Cada mutación debe seguir:

```text
1. Inspect
2. Propose
3. Validate
4. Approve
5. Apply atomically
6. Verify
7. Record event
```

## 1. Inspect

Debe:

- leer estado canónico;
- calcular revisión;
- verificar precondiciones;
- detectar locks;
- identificar dependencias;
- recopilar contexto mínimo.

## 2. Propose

Genera un ChangeSet sin modificar archivos.

El agente puede aportar juicio, pero no aplicar directamente.

## 3. Validate

El script valida:

- schema;
- IDs;
- rutas;
- dependencias;
- estados;
- permisos;
- policy;
- revisión base;
- comandos permitidos.

## 4. Approve

Se solicita aprobación humana cuando:

- cambia alcance;
- existe ambigüedad;
- se ejecutan comandos destructivos;
- se acepta un riesgo;
- se omite un gate;
- se cancela o salta trabajo comprometido;
- se libera o despliega.

## 5. Apply atomically

La aplicación debe ser:

- atómica;
- idempotente;
- protegida por revisión;
- segura ante interrupciones;
- confinada al workspace.

## 6. Verify

Debe validar postcondiciones:

- archivos esperados;
- schemas;
- índices;
- referencias;
- estados;
- tests;
- evidencia;
- integridad del journal.

## 7. Record event

Cada operación debe generar un evento estructurado.

## Contrato del ChangeSet

```json
{
  "schemaVersion": 1,
  "operationId": "OP-01J...",
  "operation": "story.atomize",
  "target": {
    "releaseId": "R0001",
    "storyId": "S0001",
    "scopeId": "api"
  },
  "baseRevision": "sha256:...",
  "assumptions": [],
  "preconditions": [],
  "fileChanges": [],
  "commands": [],
  "postconditions": [],
  "requiresApproval": true
}
```

## Propiedades obligatorias

Un ChangeSet debe ser:

- validable por JSON Schema;
- serializable;
- idempotente;
- auditable;
- reintentable;
- rechazable;
- aplicable sin volver a consultar al LLM;
- inválido cuando cambia la revisión base.

## Control de concurrencia

Se recomienda optimistic locking:

```yaml
base_revision: sha256:...
```

Si el estado cambia entre `propose` y `apply`, la operación debe fallar.

No debe intentar mezclar automáticamente cambios semánticos sin una nueva inspección.

## Seguridad de comandos

No almacenar comandos como strings de shell.

Evitar:

```yaml
command: "npm run test && rm -rf ..."
```

Usar:

```yaml
command:
  executable: npm
  args:
    - run
    - test
  working_directory: web
```

## Idempotencia

Cada operación debe incluir:

```yaml
operation_id: OP-...
idempotency_key: ...
```

Reejecutar la misma operación no debe duplicar:

- stories;
- tasks;
- eventos;
- índices;
- archivos.
