# Eliminaciones propuestas

## 1. Referencias a comandos eliminados

1. Eliminar o reemplazar `/plan-scope` en:
   - `.claude-plugin/marketplace.json`
   - `docs/reference.md`
   - `docs/user-guide.md`
2. Eliminar o reemplazar `/doc-scope` en docs activos si aparece fuera de planes históricos.
3. Eliminar o reemplazar `plan-scope-skip` si aparece fuera de changelog histórico.

## 2. Conceptos antiguos en documentación activa

1. Eliminar `Scope` como unidad interna de planning en `docs/user-guide.md`.
2. Eliminar `scope-NN-name.md` en `docs/reference.md`.
3. Eliminar "scope table" y "scope consistency" en `docs/developer-guide.md`.
4. Mantener "scope" solo como alcance general cuando esté claramente usado en ese sentido.

## 3. Workflows poco operativos o huérfanos

1. Revisar posible eliminación o archivo de:
   - `planning-template/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-DEVWORKFLOW-CONSISTENCY.md`
   - `planning-template/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-PHASE5-CHAIN.md`
   - `planning-template/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-VERSIONING-ALIGNMENT.md`
2. Criterio: si no son llamados por skills ni aportan instrucciones suficientes, moverlos a `docs/design/` o completarlos.

## 4. Documentos internos antiguos

1. `docs/superpowers/plans/*` y `docs/superpowers/specs/*` contienen historia útil, pero muchas referencias antiguas a `scope`.
2. Si son documentación pública, confunden.
3. Opciones:
   - mover a `docs/design-history/`
   - añadir nota "historical design docs; may contain obsolete command names"
   - excluirlos de docs de usuario.
