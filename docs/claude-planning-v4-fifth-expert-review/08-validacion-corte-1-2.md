# Validación no circular del Corte -1.2

## Problema

No se puede validar inicialmente el Corte -1.2 con:

```text
<product-cli> check architecture --contract corte-1.2
```

El propio Corte -1.2 debe decidir y construir ese CLI.

## Estructura obligatoria

```text
spikes/
  host-integration/
  runtime-node20/
  canonical-core/
  worktree-merge/
  transaction-recovery/
  integrated-prototype/
  verify-corte-1.2.mjs
```

## Comando obligatorio durante los spikes

```text
node spikes/verify-corte-1.2.mjs
```

Agregar script:

```json
{
  "scripts": {
    "verify:corte-1.2": "node spikes/verify-corte-1.2.mjs"
  }
}
```

Validación:

```text
npm run verify:corte-1.2
```

## Responsabilidad del verificador

Debe comprobar:

- estructura de cada spike;
- estado permitido;
- criterios críticos;
- evidencia;
- fixtures;
- tests;
- ADR;
- decisión;
- resultados;
- ausencia de criterios críticos dispensados.

## Después del prototipo integrado

Agregar como prueba de regresión:

```text
<product-cli> check architecture --contract corte-1.2
```

## Criterio de aceptación

El Corte -1.2 puede verificarse antes de que exista el CLI final.

No se acepta una validación que dependa del artefacto que todavía está siendo decidido.
