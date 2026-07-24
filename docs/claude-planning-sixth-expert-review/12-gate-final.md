# Gate final para comenzar S1

## Precondiciones

Las seis correcciones deben estar aplicadas.

## Comandos obligatorios

```bash
node hooks/tests/protect-planning-state.test.mjs
npm run verify:corte-1.2 -- --structure-only
bash scripts/verify-next-generation.sh
```

## Resultados obligatorios

```text
planning-state protection hook tests: PASS
Corte -1.2 structure verification: PASS
next-generation contract verification: PASS
```

## Verificación completa

Ejecutar:

```bash
npm run verify:corte-1.2
```

Mientras los spikes estén `PLANNED`, debe producir:

```text
exit code 1
```

Esto es correcto.

## Interpretación

### Structure-only pasa

Significa:

- manifests completos;
- criterios definidos;
- contratos consistentes;
- estructura lista para iniciar.

### Verificación completa falla

Significa:

- los spikes todavía no están demostrados;
- Corte -1.2 sigue abierto.

## Condición de GO para S1

```text
structure-only PASS
next-generation gate PASS
full verifier FAIL only because S1-S6 are PLANNED
```

## Condición de NO-GO

Cualquier otro error:

- hook;
- estructura;
- drift;
- Node;
- legacy;
- manifest;
- tests.
