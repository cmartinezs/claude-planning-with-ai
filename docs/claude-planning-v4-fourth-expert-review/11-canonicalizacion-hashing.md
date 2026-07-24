# Canonicalización y hashing

## Pipeline actual

```text
YAML seguro
-> objeto validado
-> eliminar campos no semánticos
-> canonical JSON
-> UTF-8
-> SHA-256
```

La dirección es correcta.

## Estándar recomendado

Adoptar RFC 8785 JSON Canonicalization Scheme como base de serialización canónica.

Evitar una implementación ad hoc sin especificación.

## Campos no semánticos

Excluir explícitamente:

```text
revision
generated_at
updated_at
render metadata
derived status
comments
presentation-only fields
```

## Tipos de hash

Separar:

```text
content_revision
source_fingerprint
template_fingerprint
operation_hash
change_set_hash
render_hash
tree_hash
```

## Números

Definir:

- enteros grandes;
- decimales;
- precisión;
- NaN;
- Infinity;
- notación exponencial.

## Fechas

Normalizar:

```text
UTC
RFC 3339
precision definida
```

## Unicode

Definir normalización:

```text
NFC
```

o declarar explícitamente que no se normaliza.

## YAML seguro

Rechazar:

- claves duplicadas;
- custom tags;
- aliases peligrosos;
- anchors no permitidos;
- tipos implícitos ambiguos.

## Fingerprints de directorios

Un source fingerprint requiere:

```text
paths normalizados
+ orden lexicográfico
+ contenido
+ política de symlinks
+ exclusiones
+ política Git ignore
```

Puede implementarse como tree hash o manifest Merkle.

## Criterio

Dos archivos semánticamente equivalentes deben producir el mismo `content_revision`.
