# Runtime definitivo: Node.js 20+

## Decisión obligatoria

```text
Runtime 1.0
= self-contained JavaScript bundle
+ Node.js 20+ obligatorio
```

## No construir en 1.0

- binarios nativos;
- instalador propio;
- runtime embebido;
- distribución Homebrew;
- runtime administrado.

## Estructura

```text
bin/<product-cli>
runtime/dist/<product-cli>.mjs
```

## Preflight obligatorio

El launcher debe validar:

1. `node` existe.
2. La versión es `>= 20`.
3. El ejecutable tiene permisos.
4. El plugin root es válido.
5. El workspace root es válido.
6. El runtime bundle existe.
7. La salida puede producirse como JSON.

## Errores exactos

### Node ausente

```text
Node.js 20+ is required to run <product-name>.
Install Node.js and retry.
```

### Versión incompatible

```text
Node.js 20+ is required.
Detected: <detected-version>.
```

## Plataformas obligatorias

- Windows;
- WSL2;
- Linux;
- macOS.

## Casos obligatorios

- Node ausente;
- Node 18;
- Node 20;
- Node 22;
- path con espacios;
- plugin root con espacios;
- workspace con Unicode;
- actualización del plugin;
- binario con mismo nombre en PATH.

## Criterio de aceptación

El Runtime Distribution Spike valida Node 20+.

No vuelve a comparar alternativas tecnológicas.
