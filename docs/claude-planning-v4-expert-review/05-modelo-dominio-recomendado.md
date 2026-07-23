# Modelo de dominio recomendado

## Modelo objetivo

```text
Project Context
├── Scope Catalog
│   ├── Scope
│   ├── Task Guide
│   └── Test Guide
├── Policies
├── Decisions
└── Releases
    └── Release
        └── User Story / Capability
            ├── Scope Work Package
            │   └── Tasks
            └── Scope Work Package
                └── Tasks
```

Versión resumida:

```text
release -> story -> scope work package -> task
```

## Release

Responsabilidades:

- objetivo del incremento;
- alcance comprometido;
- target;
- stories;
- gates;
- riesgos;
- evidencia;
- release events;
- deployment events;
- finalización.

## User Story o Capability

Responsabilidades:

- actor;
- necesidad;
- valor;
- comportamiento esperado;
- criterios de aceptación;
- reglas funcionales;
- outcome;
- Definition of Done funcional.

La story no debe dividirse artificialmente por componentes técnicos.

## Scope Work Package

Responsabilidades:

- scope propietario;
- diseño técnico;
- interfaces;
- contratos;
- dependencias;
- riesgos;
- tasks;
- validaciones técnicas;
- evidencia del scope.

Un Work Package puede representar:

- API;
- frontend;
- agents;
- infraestructura;
- documentación;
- datos;
- compliance;
- operación manual.

## Task

Responsabilidades:

- cambio atómico;
- objetivo técnico;
- archivos esperados;
- precondiciones;
- pasos;
- pruebas;
- evidencia;
- closeout.

## Agregados sugeridos

### Project Context Aggregate

Controla:

- configuración;
- scope catalog;
- policies;
- plugin lock;
- autonomía;
- comandos permitidos.

### Release Aggregate

Controla:

- lifecycle;
- stories;
- commitment;
- release gates;
- dependencias entre stories;
- deployment events;
- finalización.

### Story Aggregate

Controla:

- valor funcional;
- criterios de aceptación;
- work packages;
- estado funcional agregado.

### Work Package Aggregate

Controla:

- ownership técnico;
- dependencias técnicas;
- tasks;
- gates del scope.

## Identidad

Los IDs deben ser inmutables.

Recomendación:

```text
R0001
S0004
WP0012
T0041
```

Los slugs deben ser decorativos.

Ejemplo:

```text
R0001-release-flow-redesign
S0004-configure-project-scopes
WP0012-api-contract
T0041-validate-schema
```

Cambiar un título no debe romper referencias.
