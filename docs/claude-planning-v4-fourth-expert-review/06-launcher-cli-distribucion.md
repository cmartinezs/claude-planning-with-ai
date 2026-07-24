# Launcher, CLI y distribución

## Distinción necesaria

La propuesta utiliza:

```text
bin/<product-cli>
```

como launcher.

Debe distinguirse:

### API conversacional

```text
/<plugin-name>:init
```

### Launcher interno del plugin

```text
<product-cli>
```

Disponible para el Bash tool mientras el plugin está habilitado.

### CLI externa opcional

Invocable desde:

- terminal;
- CI;
- scripts;
- otros agentes;
- automatizaciones fuera de Claude Code.

## Problema de nomenclatura

Llamar a `bin/<product-cli>` “CLI pública” puede inducir a error.

No necesariamente queda instalado en el PATH general del sistema.

## Recomendación

Usar:

```text
launcher interno estable del plugin
```

Solo llamarlo CLI pública si existe distribución adicional:

- npm;
- Homebrew;
- binario descargable;
- instalador;
- package manager.

## Runtime prerequisite

Opciones:

### Node obligatorio

```text
Node.js 20+
```

Con preflight:

- presencia;
- versión;
- permisos;
- mensaje de instalación;
- salida JSON.

### Binarios nativos

- Linux x64/ARM64;
- macOS x64/ARM64;
- Windows x64/ARM64.

### Instalación administrada

Runtime instalado en almacenamiento persistente del plugin.

## Decisión

El Spike de runtime debe decidir:

```text
bundle JavaScript + Node obligatorio
```

o:

```text
binario nativo
```

o:

```text
instalación administrada
```
