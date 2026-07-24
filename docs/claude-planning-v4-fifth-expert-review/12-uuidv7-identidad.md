# Identidad primaria definitiva: UUIDv7

## Decisión obligatoria

```text
Primary ID = UUIDv7
```

## Entidades

UUIDv7 se utiliza para:

- Release;
- Release Item;
- Work Package;
- Task;
- Event;
- Operation;
- Decision;
- Approval;
- Waiver;
- Blocker;
- Risk.

## Reglas

- inmutable;
- globalmente único;
- generado localmente;
- no depende de counters;
- no contiene slug;
- no contiene scope;
- no contiene título;
- no se reutiliza.

## Representación

```yaml
id: 0190f1c8-4e39-7a21-8bb2-2a45f8154ef1
```

## Paths

```text
releases/<uuidv7>/
items/<uuidv7>/
work-packages/<uuidv7>/
tasks/<uuidv7>/
```

## Validaciones

- formato UUIDv7;
- timestamp válido;
- versión correcta;
- variant correcta;
- unicidad;
- orden temporal solo como ayuda, nunca como consistencia causal.

## Prohibido

```text
ULID como alternativa abierta
IDs secuenciales como primary key
slug como identidad
display ID como foreign key
```

## Criterio de aceptación

Todos los schemas y fixtures utilizan UUIDv7.

Las referencias internas no utilizan display IDs.
