# Corrección obligatoria del hook de protección

## Archivo

```text
scripts/protect-planning-state.mjs
```

## Falla 1 — `.planning` inexistente

La implementación actual resuelve el ancestro existente más cercano.

Cuando `.planning/` no existe, ese ancestro puede ser el workspace.

Consecuencia:

```text
Write src/app.js -> deny
```

Esto es incorrecto.

## Comportamiento obligatorio

Si `.planning/` no existe:

```text
NO resolverlo mediante nearestExisting()
SÍ usar comparación léxica contra <workspace>/.planning
```

Resultados obligatorios:

```text
Write src/app.js                    -> allow
Edit README.md                      -> allow
Write .planning/config.yml          -> deny
Write /workspace/.planning/x.yml    -> deny
```

## Falla 2 — bypass por launcher

La lógica actual permite el comando si encuentra el token del launcher en cualquier posición.

Esto permite:

```bash
product-cli check health; rm -rf .planning
echo product-cli && rm -rf .planning
```

## Regla obligatoria

La excepción del launcher solo se aplica cuando:

```text
el primer ejecutable es exactamente el launcher aprobado
```

y el comando no contiene operadores de composición.

## Operadores prohibidos para la excepción

```text
;
&&
||
|
>
>>
<
newline
backticks
$(
```

## Resultados obligatorios

```text
product-cli check health                  -> allow
product-cli changeset apply OP-...        -> allow
product-cli check; rm -rf .planning       -> deny
echo product-cli && rm -rf .planning      -> deny
product-cli apply > .planning/result      -> deny
product-cli $(cat command.txt)            -> deny
```

## Falla 3 — fail-closed

El hook depende de Node.

Si Node no está disponible, el hook debe bloquear la herramienta.

## Comportamiento obligatorio

```text
Node ausente
Node < 20
script no ejecutable
JSON inválido
error interno
```

deben producir:

```text
stderr con mensaje
exit code 2
tool call denied
```

Mensaje:

```text
Planning-state protection unavailable.
Node.js 20+ is required. Tool call denied.
```

## Criterio de aceptación

El hook debe:

- permitir escrituras fuera de `.planning`;
- bloquear todas las escrituras directas dentro de `.planning`;
- permitir únicamente el launcher standalone;
- fallar cerrado.
