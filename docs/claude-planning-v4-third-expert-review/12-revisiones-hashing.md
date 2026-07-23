# Revisiones y hashing canónico

## Problema

Aparecen conceptos como:

```yaml
revision: sha256:...
fingerprint: sha256:...
baseRevisions: ...
```

Pero no existe un contrato exacto de canonicalización.

## Variables que alteran hashes

- orden de claves;
- comentarios;
- indentación;
- line endings;
- rutas;
- timestamps;
- campos derivados;
- representación de strings;
- diferencias YAML 1.1/1.2.

## Problema circular

```yaml
revision: sha256:...
```

Si la revisión incluye el campo `revision`, el archivo contiene su propio hash.

## Pipeline recomendado

```text
YAML 1.2 seguro
-> objeto validado
-> eliminar campos no semánticos
-> canonical JSON
-> UTF-8
-> SHA-256
```

## Campos excluidos

Ejemplo:

```text
revision
generated_at
updated_at
derived fields
render metadata
```

## Reglas YAML

Rechazar:

- claves duplicadas;
- custom tags;
- aliases peligrosos;
- anchors no permitidos;
- valores ambiguos;
- tipos implícitos de YAML 1.1.

## Tipos de hash

Distinguir:

```text
content_revision
source_fingerprint
template_fingerprint
operation_hash
change_set_hash
render_hash
```

## Reproducibilidad

Dos archivos semánticamente equivalentes deben producir el mismo `content_revision`.
