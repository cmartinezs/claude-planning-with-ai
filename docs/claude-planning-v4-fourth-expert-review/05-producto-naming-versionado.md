# Producto, naming y versionado

## Decisión pendiente

La documentación debe decidir entre:

### Continuidad

```text
claude-planning-with-ai
4.0.0
```

### Producto nuevo

```text
<new-product-name>
1.0.0
```

## Contradicción actual

Algunos documentos tratan `v4.0.0` como supuesto.

El Corte -1.2 todavía exige decidir si será:

- v4 del plugin actual;
- producto nuevo 1.0.0.

## Recomendación documental

Mientras la decisión esté abierta, usar:

```yaml
plugin:
  version: <product-version>
  schema_version: <schema-version>
```

Y referirse al esfuerzo como:

```text
next-generation redesign
```

aunque `v4` se mantenga internamente como nombre histórico.

## Impactos de un producto nuevo

- namespace diferente;
- manifest distinto;
- marketplace distinto;
- instalación distinta;
- almacenamiento persistente distinto;
- migración explícita;
- actualización no automática;
- soporte paralelo de v3.

## Naming gate

Validar:

- GitHub;
- npm;
- PyPI;
- crates.io;
- Homebrew;
- Chocolatey;
- dominios;
- marketplaces;
- buscadores;
- paquetes;
- binarios;
- marcas relevantes.

## Criterios del nombre

- distintivo;
- pronunciable;
- corto;
- buscable;
- disponible;
- no atado exclusivamente a Claude;
- compatible con plugin y CLI;
- usable con namespace slash.

## Decisión

No modificar definitivamente:

- manifest;
- binario;
- sitio;
- package names;
- marketplace;
- documentación pública;

hasta cerrar naming y producto.
