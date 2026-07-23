# Packaging, launcher y runtime

## Launcher raíz

Estructura recomendada:

```text
bin/
  claude-planning

runtime/
  dist/
    claude-planning.mjs
```

El launcher raíz debe ser mínimo.

## Bundle self-contained

No depender de `npm install` en el workspace usuario.

El bundle debe incluir:

- YAML parser;
- JSON Schema validator;
- argument parser;
- hashing;
- globbing;
- locks;
- renderers.

## Estructura de desarrollo

```text
runtime/
  src/
    commands/
    lib/
    schemas/
  dist/
    claude-planning.mjs
  package.json
  package-lock.json
  build.mjs
```

## Build reproducible

Debe registrar:

- Node version;
- package lock;
- bundler version;
- output hash;
- source commit.

## Cross-platform

Probar:

- Linux;
- macOS;
- WSL2;
- Windows nativo;
- Git Bash si se declara soporte.

## Paths

No asumir:

- `/`;
- permisos Unix;
- symlinks habilitados;
- case sensitivity;
- bash;
- line endings LF;
- ejecutables `.sh`.

## Plugin root

El launcher debe resolver el plugin root mediante el mecanismo soportado por el entorno.

No debe buscar rutas relativas frágiles desde el cwd.

## Template pack

El runtime debe localizar:

```text
template-pack/
```

mediante una referencia estable relativa al plugin root.

## Compatibilidad

El launcher debe validar:

- plugin version;
- schema version;
- template pack version;
- workspace lock;
- migraciones requeridas.

## Spike obligatorio

Antes de implementar el runtime completo, construir un spike que demuestre:

1. instalación del plugin;
2. comando visible en PATH;
3. ejecución del launcher;
4. lectura del plugin root;
5. creación de `.planning/`;
6. carga de dependencia empaquetada;
7. ejecución en WSL2 y al menos otro sistema.
