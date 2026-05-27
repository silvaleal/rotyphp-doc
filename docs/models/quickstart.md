# Uso básico

## Criação
```php
<?php
# /path/to/models/user.php

use RotyPHP\SQLite3\SQLiteModel;

# Criando nosso Model.
class User extends SQLiteModel
{
    public ?string $table = 'users';
}
```

## Exemplos

### create

```php
$user = new User();

$user->create([
    'name' => 'João Silva',
    'email' => 'joao@exemplo.com',
]);
```

### edit

```php
$user = new User();

$user->where('id', 1)->edit([
    'name' => 'Maria Souza',
]);
```

### delete

```php
$user = new User();

$user->delete([
    'id' => 1,
]);
```

### getAll

```php
$user = new User();

$admins = $user->where('role', 'admin')->getAll('id, name, email');

$firstAdmin = (new User())->getFirst(string $columns = '*')
```

### getFirst

```php
$user = new User();

$admins = $user->where('role', 'admin')->getAll('id, name, email');

$firstAdmin = (new User())->where('role', 'admin')->getFirst('id, name');
```
