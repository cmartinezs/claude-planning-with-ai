# Flujo E — Pipeline autónomo con agentes

> [← Tutorial](README.md)

**Cuándo usar este flujo:** quieres ejecutar un planning de punta a punta con mínima intervención manual. Un solo comando detecta el estado actual, muestra el plan de ejecución, pide una única confirmación y delega el resto a agentes especializados. Los scopes independientes se ejecutan en paralelo.

---

## Cuándo es la opción correcta

| Situación | Recomendación |
|-----------|---------------|
| Quieres ejecutar todo el ciclo desde una idea | `plan-run "descripción"` |
| El planning ya existe y quieres terminarlo de un tirón | `plan-run NNN-slug` |
| Quieres control paso a paso de cada scope | Usa los flujos B o A con `/plan-scope` |
| Necesitas revisar cada tarea antes de continuar | Usa `/plan-atomize` + `/plan-task` manualmente |

---

## Opción 1 — Desde cero con una descripción

```
/plan-run "Implement JWT authentication for the API layer"
```

Claude detecta modo from-scratch, deriva un ID y muestra el plan completo antes de hacer nada:

```
Planning: 001-jwt-auth-api  (nuevo)
Estado actual: —

Fases a ejecutar:
✓ plan-agent-plan    — crear planning y expandir a scopes
✓ plan-agent-execute — atomizar + ejecutar N scopes (estimado: X lotes paralelos)
✓ plan-agent-validate — validar + archivar

¿Continuar? (sí/no)
```

Una sola respuesta `sí` — y el pipeline corre solo.

---

## Opción 2 — Desde un planning existente

```
/plan-run 001-jwt-auth-api
```

Claude detecta el estado actual y calcula qué fases quedan:

```
Planning: 001-jwt-auth-api
Estado actual: DEEPENING (2 de 4 scopes completados)

Fases a ejecutar:
✗ plan-agent-plan    — omitida (planning ya en ACTIVE)
✓ plan-agent-execute — retoma scope-03, scope-04 (pendientes)
✓ plan-agent-validate — validar + archivar

Ejecución paralela: scope-03 y scope-04 no tienen dependencias entre sí.

¿Continuar? (sí/no)
```

---

## Qué hace cada agente de fase

### `/plan-agent-plan` — planificación autónoma

Crea el planning (si es desde cero) y lo expande a scopes sin pedir confirmaciones intermedias. Infiere los scopes desde `00-initial.md`.

```
/plan-agent-plan 001-jwt-auth-api
/plan-agent-plan "Implement JWT authentication"   ← from-scratch
```

### `/plan-agent-execute` — ejecución paralela

Lee el grafo de dependencias de los scopes y los ejecuta por lotes. Dentro de cada lote, los scopes independientes corren en paralelo — cada uno en su propio subagente Claude:

```
Lote 1: scope-01-docs, scope-02-api-domain   ← sin dependencias → paralelo
Lote 2: scope-03-api-auth                    ← depende de scope-02 → espera
Lote 3: scope-04-web-login                   ← depende de scope-03 → espera
```

Por cada scope, el subagente ejecuta:
1. `/plan-atomize NNN-slug scope-NN` — descompone en tareas atómicas
2. `/plan-scope NNN-slug scope-NN` — ejecuta todas las tareas

```
/plan-agent-execute 001-jwt-auth-api
```

### `/plan-agent-validate` — cierre sin fricciones

Ejecuta `/plan-validate` y, si no hay FAIL, cierra el planning y lo archiva:

```
/plan-agent-validate 001-jwt-auth-api
```

Si la validación reporta problemas, lista los FAILs y se detiene sin archivar. Corrige manualmente y vuelve a invocar el agente.

---

## Qué pasa si un scope falla

Si un subagente no puede completar un scope, lo marca como `BLOCKED` en el archivo del scope y continúa con los scopes restantes. Al final de `/plan-agent-execute` verás:

```
Scopes completados: 3/4
Scopes bloqueados:
  scope-03-api-auth — BLOCKED: plan-atomize falló (ver scope file para detalle)
```

`/plan-agent-validate` detectará que no todos los scopes están `DONE` y se detendrá sin archivar. Para retomar:

```bash
# Revisar el scope bloqueado manualmente
cat .planning/active/001-jwt-auth-api/02-deepening/scope-03-api-auth.md

# Corregir y re-ejecutar solo ese scope
/plan-scope 001-jwt-auth-api scope-03

# Luego retomar el pipeline desde la fase de validación
/plan-agent-validate 001-jwt-auth-api
```

---

## Diferencia con el flujo manual

| | Flujo B (manual) | Flujo E (agentes) |
|--|-----------------|------------------|
| Confirmaciones | Una por scope | Una total al inicio |
| Ejecución de scopes | Secuencial, comando a comando | Paralela donde sea posible |
| Atomización | Opcional, manual | Automática por el agente |
| Control granular | Total | Bajo (intervención solo en errores) |
| Cuándo usarlo | Al querer revisar cada paso | Al querer delegar todo |

---

> [← Tutorial](README.md)
