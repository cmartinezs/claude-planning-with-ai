# Lifecycle de display IDs

## Problema

Los IDs primarios están definidos como ULID o UUIDv7.

Los usuarios operan con:

```text
R0001
RI0001
WP0001
T0001
```

No está definido cómo se asignan y reconcilian.

## Preguntas abiertas

- ¿Se asignan al crear?
- ¿Son provisionales?
- ¿Se reasignan al integrar?
- ¿Son globales o por release?
- ¿Hay aliases?
- ¿Cómo se resuelve una colisión?
- ¿Qué ocurre en dos worktrees?
- ¿Se permiten gaps?
- ¿Se pueden reutilizar IDs cancelados?

## Modelo posible

```yaml
id: 019...
display_id: RI0042
display_id_status: committed
aliases:
  - RI0038
```

## Estados posibles

```text
UNASSIGNED
PROVISIONAL
COMMITTED
ALIASED
RETIRED
```

## Estrategias

### Asignación al crear

Simple, pero colisionable entre branches.

### Asignación al integrar

Más robusta, pero el usuario trabaja temporalmente sin display ID estable.

### ID humano derivado del primary ID

Elimina counters.

Ejemplo:

```text
RI-7H3K9
```

## Recomendación inicial

Para el primer runtime, considerar una forma humana derivada del ID distribuido.

Postergar counters secuenciales hasta demostrar una estrategia de merge segura.

## Reglas

- no exigir continuidad;
- no reutilizar;
- mantener aliases;
- referencias internas siempre por primary ID;
- resolver display ID solo como entrada humana.
