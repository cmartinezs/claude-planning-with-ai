# Tests obligatorios antes de S1

## Hook

Agregar exactamente:

```text
write-outside-before-planning
edit-outside-before-planning
write-inside-before-planning
absolute-planning-path
dotdot-planning-path
symlink-planning-path
launcher-standalone-query
launcher-standalone-apply
launcher-chained-rm
launcher-token-not-first
launcher-with-redirect
launcher-with-pipe
launcher-with-command-substitution
node-missing-fails-closed
node-18-fails-closed
invalid-json-fails-closed
```

## Verificador de spikes

Agregar:

```text
structure-planned-valid
passed-with-empty-evidence-invalid
passed-with-empty-fixtures-invalid
passed-with-empty-tests-invalid
passed-with-null-adr-invalid
passed-with-null-decision-invalid
passed-with-null-result-invalid
passed-with-pending-criterion-invalid
passed-with-failed-pass-criterion-invalid
limited-with-critical-failure-invalid
limited-without-reopen-condition-invalid
complete-passed-valid
```

## Verificador next-generation

Agregar tests para:

```text
legacy-state-detected
ulid-example-detected
hybrid-path-detected
move-stage-detected
fallback-namespace-detected
node-version-invalid
```

## Resultado requerido

```text
all tests passed
```

## Prohibición

No se acepta:

- test omitido;
- test marcado skip;
- expected failure;
- warning en lugar de failure;
- test manual como sustituto del automatizado.
