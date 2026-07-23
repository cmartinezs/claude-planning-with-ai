# Decisión de producto y versionado

## Alternativa A — Mismo plugin, versión 4

```text
claude-planning-with-ai
4.0.0
```

### Ventajas

- conserva instalación;
- mantiene historial;
- upgrade path conocido.

### Desventajas

- cambio total de modelo;
- comandos nuevos;
- storage nuevo;
- branding parcial;
- ausencia de compatibilidad;
- riesgo de expectativas incorrectas.

## Alternativa B — Producto nuevo

```text
<nuevo-nombre>
1.0.0
```

Mantener:

```text
claude-planning-with-ai 3.x
```

en mantenimiento.

### Ventajas

- identidad limpia;
- versionado coherente;
- no promete compatibilidad;
- marketplace separado;
- arquitectura nueva sin residuos.

### Desventajas

- dos productos;
- migración explícita;
- no hay upgrade automático;
- adopción desde cero.

## Evaluación

La propuesta introduce:

- nueva marca;
- nueva API;
- nuevo storage;
- nuevo dominio;
- nuevo runtime;
- cero aliases;
- cero compatibilidad.

Arquitectónicamente se parece más a un producto nuevo que a una versión 4.

## Decisión requerida

Antes de modificar manifests:

1. decidir continuidad o producto nuevo;
2. cerrar naming;
3. probar namespace real;
4. definir migración/export;
5. definir soporte de v3.
