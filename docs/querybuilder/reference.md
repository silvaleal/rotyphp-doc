# Referência

## SELECT

Use `q_select()` para construir queries de leitura.

### Assinatura

```php
public function q_select(string $columns = '*')
```

### Exemplo básico

```php
use RotyQuery\QueryBuilder;

$qb = new QueryBuilder();
$qb->q_setTable('users');
$qb->q_select();

echo $qb->q_builder();
// SELECT * FROM users
```

### Selecionando colunas específicas

```php
$qb->q_setTable('users');
$qb->q_select('id, name, email');

echo $qb->q_builder();
// SELECT id, name, email FROM users
```


## INSERT

Use `q_insert()` para montar um `INSERT` com placeholders.

### Assinatura

```php
public function q_insert(array $data)
```

### Exemplo

```php
use RotyQuery\QueryBuilder;

$qb = new QueryBuilder();
$qb->q_setTable('users');
$qb->q_insert([
    'name' => 'Ana',
    'email' => 'ana@example.com',
]);

echo $qb->q_getQuery();
// INSERT INTO users (name,email) VALUES (:name,:email)
```

### Bindings

O método armazena um array de bindings em memória para uso posterior (por exemplo, ao executar com PDO).

Estrutura gerada:

```php
[
    ':name' => 'Ana',
    ':email' => 'ana@example.com',
]
```

## UPDATE

Use `q_update()` para montar um `UPDATE` com placeholders.

### Assinatura

```php
public function q_update(array $data)
```

### Exemplo

```php
use RotyQuery\QueryBuilder;

$qb = new QueryBuilder();
$qb->q_setTable('users');
$qb->q_update([
    'name' => 'Ana Silva',
    'active' => 1,
]);
$qb->q_where('id', 10);

echo $qb->q_builder();
// UPDATE users SET name = :name,active = :active WHERE id = 10
```

### Bindings

Estrutura gerada:

```php
[
    ':name' => 'Ana Silva',
    ':active' => 1,
]
```

## WHERE

Use `q_where()` para adicionar condições. As condições são acumuladas e concatenadas com `AND`.

### Assinatura

```php
public function q_where(string $column, int|string $value)
```

### Exemplo

```php
use RotyQuery\QueryBuilder;

$qb = new QueryBuilder();
$qb->q_setTable('users');
$qb->q_select();
$qb->q_where('role', 'admin');
$qb->q_where('active', 1);

echo $qb->q_builder();
// SELECT * FROM users WHERE role = 'admin' AND active = 1
```

### Como o valor é serializado

- Valores numéricos são inseridos sem aspas.
- Demais valores viram strings com aspas simples e escape básico.

### Observação de segurança

O método atual monta o `WHERE` por concatenação e faz escape simples. Em aplicações reais, prefira queries parametrizadas (prepared statements) para evitar SQL Injection.

## JOIN

Use `q_join()` para anexar um `JOIN` à query atual (normalmente um `SELECT`).

### Assinatura

```php
public function q_join(string $table, string $key, string $field)
```

### Exemplo

```php
use RotyQuery\QueryBuilder;

$qb = new QueryBuilder();
$qb->q_setTable('users');
$qb->q_select('users.id, users.name, profiles.avatar');
$qb->q_join('profiles', 'users.id', 'profiles.user_id');

echo $qb->q_builder();
// SELECT users.id, users.name, profiles.avatar FROM users JOIN profiles ON users.id = profiles.user_id
```

### Notas

- O método adiciona `JOIN` (inner join) diretamente na SQL.
- Para joins mais complexos (LEFT/RIGHT, múltiplas condições), será necessário estender a implementação atual.

## DELETE

Use `q_del()` para montar um `DELETE`.

### Assinatura

```php
public function q_del(array $data)
```

### Exemplo

```php
use RotyQuery\QueryBuilder;

$qb = new QueryBuilder();
$qb->q_setTable('users');
$qb->q_del([
    'id' => 10,
]);

echo $qb->q_getQuery();
// DELETE FROM users WHERE id = :id
```

### Observações

- Diferente de `q_where()`, este método recebe um array e sempre gera `WHERE coluna = :placeholder` usando a primeira chave.
- Se você precisa de múltiplas condições ou `AND/OR`, prefira construir um `DELETE` via `q_where()` após um `q_select()`/extensão do builder.

