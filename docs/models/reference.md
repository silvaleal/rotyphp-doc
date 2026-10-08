# Referência

Os métodos abaixo são disponibilizados pela classe `RotyPHP\Model`, que deve ser estendida pelos seus modelos. Eles combinam a construção da query e a execução via PDO.

## create

Insere um novo registro na tabela.

### Assinatura

```php
public function create(array $data)
```

### Exemplo

```php
$user = new User();

$user->create([
    'name' => 'João Silva',
    'email' => 'joao@exemplo.com',
]);
```

## edit

Atualiza registros. Use `where()` antes para definir quais linhas serão afetadas.

### Assinatura

```php
public function edit(array $data)
```

### Exemplo

```php
$user = new User();

$user->where('id', 1)->edit([
    'name' => 'Maria Souza',
]);
```

## delete

Remove registros da tabela a partir do array informado.

### Assinatura

```php
public function delete(array $data)
```

### Exemplo

```php
$user = new User();

$user->delete(['id' => 1]);
```

## where

Adiciona uma condição `WHERE`. As condições são acumuladas e concatenadas com `AND`.

### Assinatura

```php
public function where(string $column, int|string $value, string $symbol = "=")
```

### Exemplo

```php
$user = new User();

$user->where('role', 'admin');
$user->where('active', 1);

$admins = $user->getAll();
```

## join

Adiciona um `JOIN` (inner join) à query.

### Assinatura

```php
public function join(string $table, string $key, string $field)
```

### Exemplo

```php
$user = new User();

$user->join('profiles', 'users.id', 'profiles.user_id');

$rows = $user->getAll('users.id, users.name, profiles.avatar');
```

## order

Define a ordenação dos resultados.

### Assinatura

```php
public function order(string $column, string $order = 'ASC')
```

### Exemplo

```php
$user = new User();

$user->order('name', 'ASC');

$users = $user->getAll();
```

## limit

Limita o número de registros retornados.

### Assinatura

```php
public function limit(int $limit)
```

### Exemplo

```php
$user = new User();

$user->limit(10);

$users = $user->getAll();
```

## getAll

Executa a query e retorna todos os registros como um array associativo.

### Assinatura

```php
public function getAll(string $columns = '*')
```

### Exemplo

```php
$user = new User();

$admins = $user->where('role', 'admin')->getAll('id, name, email');
```

## getFirst

Executa a query e retorna o primeiro registro.

### Assinatura

```php
public function getFirst(string $columns = '*')
```

### Exemplo

```php
$user = new User();

$firstAdmin = $user->where('role', 'admin')->getFirst('id, name');
```