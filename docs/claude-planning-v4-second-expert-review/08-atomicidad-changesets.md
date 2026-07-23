# Atomicidad y ChangeSets

## Protocolo objetivo

```text
inspect
  -> propose
    -> validate
      -> approve
        -> stage
          -> apply
            -> verify
              -> record
```

## Directorio de operación

```text
.planning/.operations/<operation-id>/
  operation.yml
  change-set.json
  before/
  staged/
  result.json
```

## Estados de operación

```text
PROPOSED
VALIDATED
APPROVED
STAGED
APPLYING
APPLIED
VERIFIED
RECORDED
FAILED
ROLLED_BACK
```

## Atomicidad del estado canónico

La operación debe:

1. cargar revisiones;
2. validar schemas;
3. validar boundaries;
4. construir staging;
5. comprobar postcondiciones simuladas;
6. bloquear agregados afectados;
7. aplicar estado canónico;
8. verificar;
9. registrar evento;
10. regenerar proyecciones.

## Proyecciones

Las proyecciones Markdown pueden regenerarse después del commit de estado canónico.

No deben bloquear una operación válida salvo que la política lo exija.

## Rollback

Debe distinguirse:

- rollback de archivos;
- compensación lógica;
- rollback de comandos externos;
- rollback imposible.

Ejemplo:

```yaml
rollback:
  strategy: restore-files
  external_effects:
    reversible: false
```

## Comandos externos

Una operación que ejecuta:

- Git;
- GitHub;
- deployment;
- test environment;
- API externa;

no puede considerarse completamente atómica.

Debe modelarse como saga:

```text
prepare
execute
verify
compensate
```

## Approval binding

La aprobación debe incluir:

```yaml
approval:
  actor: ...
  change_set_hash: sha256:...
  approved_at: ...
```

Modificar el ChangeSet invalida la aprobación.

## CQS

`plan-check` no debe mutar.

Debe devolver:

```json
{
  "valid": false,
  "findings": [],
  "recommendedOperations": []
}
```
