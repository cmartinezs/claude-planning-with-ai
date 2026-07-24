# Display IDs definitivos

## Decisión obligatoria

El display ID debe derivarse determinísticamente del UUIDv7.

## Formato

```text
R-7H3K9Q2M
RI-4F8Q2B7X
WP-9M2AB6RT
T-3Q6NZ8KD
```

## Reglas

- se asigna al crear;
- es inmutable;
- no usa counters;
- no tiene estado provisional;
- no necesita aliases en 1.0;
- no se reutiliza;
- no cambia con título;
- no cambia con parent;
- no es referencia interna.

## Derivación

Usar:

```text
prefix
+ "-"
+ base32-crockford(short-hash(UUIDv7))
```

Longitud recomendada:

```text
8 caracteres
```

## Colisión

El runtime debe:

1. derivar display ID;
2. buscar colisión;
3. ampliar longitud si existe;
4. persistir el resultado.

## Estado

Eliminar para 1.0:

```text
UNASSIGNED
PROVISIONAL
ALIASED
```

Mantener solo:

```text
ACTIVE
RETIRED
```

como disponibilidad del alias humano.

## Resolver

El resolver acepta:

- UUIDv7;
- display ID exacto.

No acepta:

- slug solo;
- título;
- coincidencia aproximada;
- heurística silenciosa.

## Criterio de aceptación

Dos worktrees pueden crear entidades sin coordinación y sin colisión de display IDs práctica.

No existe counter compartido.
