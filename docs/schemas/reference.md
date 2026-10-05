# Referência

## Tipos

- varchar($column, $length)
- text($column)
- int($column)
- bigint($column)
- float($column)
- bool($column)
- datetime($column)

## Modificadores de Coluna

Os modificadores são aplicados logo após a definição do tipo da coluna:

```php
$schema->varchar("email", 150)->unique(); # modificador: unique
$schema->varchar("status", 20)->default("active"); # modificador: default
```

- primKey()
- autoinc()
- unique()
- default($default)
- defaultRaw($expression)

## Chaves Estrangeiras

```php
$schema->int("user_id")->foreignkey("user_id", "users", "id");
```