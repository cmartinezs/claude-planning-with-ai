# Contrato de ejecución de skills

## Problema

Las skills entregan instrucciones a Claude.

Claude utiliza herramientas, normalmente Bash, para invocar el launcher.

No existe todavía un contrato explícito de permisos y preaprobación.

## Metadata recomendada

Cada skill debería definir:

```yaml
disable-model-invocation: true | false
allowed-tools:
  - Bash(<product-cli> ...)
```

## Política por operación

| Operación | Preaprobación sugerida |
|---|---|
| `check` | permitida |
| `status` | permitida |
| `inspect` | permitida |
| `propose` | permitida |
| `validate` | permitida |
| `approve` | no permitida |
| `apply` | no permitida por defecto |
| Git mutante | según policy |
| deployment | aprobación explícita |

## Distinción importante

Existen dos capas diferentes:

### Permisos del host

Controlan si Claude puede ejecutar Bash o una herramienta.

### Aprobación del runtime

Controla si un ChangeSet específico puede aplicarse.

Una capa no reemplaza a la otra.

## Skill contract

Cada `SKILL.md` debe declarar:

- intención;
- argumentos;
- precondiciones;
- launcher;
- herramientas;
- comandos permitidos;
- aprobaciones;
- stop conditions;
- manejo de error;
- salida esperada.

## Autoapproval

Debe existir una policy explícita:

```yaml
approvals:
  allow_agent_self_approval: false
```

## Resultado esperado

Una skill no debe poder:

- aprobar su propio ChangeSet;
- ocultar cambios;
- ejecutar apply sin policy;
- saltar checks;
- modificar `.planning/` directamente.
