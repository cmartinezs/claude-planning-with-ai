# Especificación de la DSL

## Estado actual

La DSL ya define operadores:

```text
equals
not_equals
contains
exists
all
any
not
in
matches
```

Esto es una mejora correcta.

## Contratos faltantes

### Sistema de tipos

Definir tipos permitidos:

```text
string
number
boolean
null
array
object
date
datetime
```

### Field paths

Definir sintaxis:

```text
item.kind
item.tags
work_package.contracts.api
```

### Campos inexistentes

Decidir si:

- retornan false;
- retornan null;
- producen error.

### Coerción

Recomendación:

```text
no implicit coercion
```

### Strings

Definir:

- case sensitivity;
- Unicode;
- trimming;
- locale.

### Arrays

Definir semántica de:

- contains;
- in;
- any;
- all.

### Evaluación

Definir:

- short-circuit;
- orden;
- errores;
- tracing.

### Regex

`matches` debe declarar:

- motor regex;
- límites;
- timeout;
- tamaño máximo;
- protección contra ReDoS.

## Versionado

```yaml
dsl_version: 1
```

## Corrección del ejemplo UI

Ejemplo actual:

```yaml
applies_when:
  any:
    - item.kind in [user_story, capability]
    - item.tags contains ui
```

Esto activa la regla para cualquier User Story aunque no sea UI.

Probablemente debería ser:

```yaml
applies_when:
  all:
    - item.kind in [user_story, capability]
    - item.tags contains ui
```

## Criterio de aceptación

La DSL debe poder evaluarse:

- sin LLM;
- sin Markdown;
- con resultado reproducible;
- con error estructurado;
- con trace de decisión.
