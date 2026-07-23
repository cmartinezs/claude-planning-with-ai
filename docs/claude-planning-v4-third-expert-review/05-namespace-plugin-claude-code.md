# Namespace de plugins Claude Code

## Problema

La propuesta documenta:

```text
/arc-init
/arc-config
/arc-release
```

Pero las skills distribuidas mediante plugins pueden exponerse con namespace:

```text
/plugin-name:skill-name
```

## Consecuencia

Si el plugin se llama:

```text
claude-planning-with-ai
```

y la skill:

```text
arc-init
```

la superficie efectiva puede ser:

```text
/claude-planning-with-ai:arc-init
```

Si el plugin se llama `arc-flow`, la forma puede ser:

```text
/arc-flow:arc-init
```

Esto duplica la marca.

## Modelo recomendado

Plugin:

```text
<product-name>
```

Skills:

```text
skills/init/
skills/config/
skills/release/
skills/item/
skills/task/
skills/check/
skills/report/
skills/decision/
```

Superficie:

```text
/<product-name>:init
/<product-name>:config
/<product-name>:release
```

## Regla de diseño

La API pública debe diseñarse como:

```text
plugin name + skill name
```

No como si las skills fueran comandos standalone.

## Spike obligatorio

Instalar un plugin mínimo y verificar:

- nombre real del comando;
- autocompletado;
- cómo se presenta en ayuda;
- colisiones;
- experiencia de uso;
- compatibilidad con renaming.
