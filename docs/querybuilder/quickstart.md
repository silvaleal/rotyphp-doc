# Quickstart

Este guia mostra o fluxo básico para gerar uma query SQL com o `QueryBuilder`.

## Exemplo

```php
use RotyQuery\QueryBuilder;

$qb = new QueryBuilder();
$qb->q_setTable('users');
$qb->q_select('*');
$qb->q_where('role', 'user');

echo $qb->q_builder();
// SELECT * FROM users WHERE role = 'user'
```

## Observações de uso

- `q_setTable()` define a tabela alvo.
- `q_select()` prepara a query do tipo SELECT.
- `q_where()` acumula filtros; múltiplas chamadas viram `AND`.
- `q_builder()` monta e retorna a SQL final.

