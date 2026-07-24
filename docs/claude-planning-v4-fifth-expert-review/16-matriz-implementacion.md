# Matriz de implementación obligatoria

| ID | Acción | Archivo o componente | Resultado esperado | Bloquea spikes |
|---|---|---|---|---|
| A01 | Eliminar fallback | `02-mapa-comandos-skills.md` | solo namespace plugin | sí |
| A02 | Eliminar fallback | `09-corte-1-2-spikes-producto-runtime.md` | sin `/acronym-*` | sí |
| A03 | Restringir allowed-tools | contratos de skills | comandos exactos | sí |
| A04 | Agregar hooks | `hooks/hooks.json` | PreToolUse activo | sí |
| A05 | Agregar protector | `scripts/protect-planning-state.mjs` | bloquea direct writes | sí |
| A06 | Marcar criterios críticos | template de spikes | `critical/waivable` | sí |
| A07 | Corregir state machine | contratos runtime | estados definitivos | sí |
| A08 | Crear verificador externo | `spikes/verify-corte-1.2.mjs` | no circular | sí |
| A09 | Completar Corte 0 | `03-plan-incremental.md` | todos los catálogos | sí |
| A10 | Corregir Corte -1.1 | `08-corte-1-1-contratos-runtime.md` | no habilita runtime | sí |
| D01 | Declarar producto nuevo | docs de producto | 1.0.0 | sí |
| D02 | Declarar Node 20+ | runtime contract | sin alternativas | sí |
| D03 | Declarar UUIDv7 | identity contract | único primary ID | sí |
| D04 | Simplificar display ID | identity contract | determinista | sí |
| D05 | Parent inmutable | schemas | sin move | sí |

## Regla

Todos los elementos A01–A10 y D01–D05 deben quedar completos antes de iniciar S1.

## Evidencia requerida

Cada elemento debe incluir:

- commit;
- diff;
- prueba;
- referencia documental;
- responsable;
- fecha.

## Criterio de aprobación

```text
15/15 complete
```

Cualquier valor inferior bloquea el inicio de los spikes.
