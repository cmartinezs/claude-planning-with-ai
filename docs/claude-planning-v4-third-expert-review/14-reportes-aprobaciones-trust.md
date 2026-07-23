# Reportes, aprobaciones y trust model

## `/arc-report` y mutaciones

`/arc-check` quedó query-only.

`/arc-report` todavía puede generar Markdown.

Si escribe archivos, es una mutación.

## Opciones

### Reporte query-only

```text
/arc-report status
/arc-report release-notes
```

Salida a stdout.

### Render mediante ChangeSet

```text
/arc-report render propose
```

Produce una operación.

### Comando separado

```text
/arc-render
```

No recomendado inicialmente porque aumenta superficie pública.

## Recomendación

Mantener `/arc-report`, pero exigir `propose` cuando escriba proyecciones.

## Approval binding

La aprobación debe incluir:

```yaml
approval:
  actor: ...
  change_set_hash: sha256:...
  approved_at: ...
```

Modificar el ChangeSet invalida la aprobación.

## Limitación

El agente que puede ejecutar el launcher también puede intentar:

```text
changeset approve
```

La aprobación no es una barrera criptográfica por defecto.

## Trust model

Declarar:

> El sistema provee guardrails, trazabilidad y human-in-the-loop cooperativo. No es una sandbox frente a un agente malicioso con acceso equivalente al usuario.

## Refuerzos

- confirmación explícita;
- actor y sesión;
- texto de aprobación;
- policy que prohíba autoapproval;
- challenge interactivo;
- hooks;
- detección de drift;
- permisos de filesystem cuando sea posible;
- auditoría de llamadas.

## Riesgo inherente

Un plugin es código de alta confianza ejecutado con permisos del usuario.

La seguridad depende también de:

- origen;
- revisión;
- actualizaciones;
- integridad del plugin.
