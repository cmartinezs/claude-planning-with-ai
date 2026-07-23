# Evaluación del bridge v3.11

## Contexto

El commit más reciente agregó:

```text
/plan-from-release
```

para la línea v3.11.

Su objetivo es crear un bridge determinista desde documentos de release hacia el modelo de planning v3.

## Evaluación

Este bridge no invalida la propuesta v4.

Debe tratarse como:

```text
v3 maintenance bridge
```

No como base del nuevo runtime.

## Elementos potencialmente reutilizables

Puede rescatarse:

- parsing puro;
- validaciones independientes;
- fixtures;
- normalización de inputs;
- detección de fuentes;
- conocimiento sobre documentos de release.

## Elementos que no deben trasladarse

No rescatar:

- storage `.releases/`;
- release -> plannings;
- active/finished;
- IDs legacy;
- Markdown como estado;
- jerarquías INITIAL/EXPANSION;
- comandos separados por wrapper.

## Destino v4

La capacidad puede convertirse en:

```text
/release plan
```

o:

```text
/plan-story import
```

operando sobre:

- Release Items;
- Work Packages;
- ChangeSets;
- estado estructurado.

## Regla de aislamiento

El código v3.11 no debe condicionar:

- schemas v4;
- storage v4;
- launcher v4;
- modelo de dominio v4;
- arquitectura del runtime.
