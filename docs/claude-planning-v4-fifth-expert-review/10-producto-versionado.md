# Decisión definitiva de producto y versionado

## Decisión obligatoria

Implementar como producto nuevo.

```text
claude-planning-with-ai 3.x
  -> maintenance only

<new-product-name> 1.0.0
  -> next-generation implementation
```

## No implementar como

```text
claude-planning-with-ai 4.0.0
```

## Razón

El rediseño cambia:

- nombre;
- namespace;
- dominio;
- storage;
- runtime;
- skills;
- comandos;
- versionado;
- instalación;
- marketplace;
- compatibilidad.

Esto es un producto nuevo, no un upgrade compatible.

## Versiones iniciales

```yaml
plugin:
  version: 1.0.0
  schema_version: 1
  template_pack:
    version: 1.0.0
```

## Repositorio

Se permite mantener el mismo repositorio durante la fase experimental.

Antes de publicar debe decidirse:

```text
nuevo repositorio
```

o:

```text
mismo repositorio con producto reemplazado
```

Recomendación obligatoria para publicación:

```text
nuevo repositorio y nuevo marketplace entry
```

## Migración

La migración desde v3:

- no forma parte del runtime 1.0;
- puede existir como herramienta separada;
- no debe condicionar el diseño;
- no debe crear aliases legacy.

## Criterio de aceptación

Toda documentación activa debe declarar:

```text
producto nuevo 1.0.0
```

No debe mantener abierta la alternativa v4 versus 1.0.
