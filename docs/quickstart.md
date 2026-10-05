# Quickstart

## Básico
```php
<?php 

require 'vendor/autoload.php';

use RotyPHP\Database;

# Obrigatório
# É com este código que o rotyphp identifica qual banco de dados deseja usar
RotyDriver::setName("sqlite");
SQLiteDriver::define(__DIR__."/../database.db");
RotyDatabase::setConnector(RotyDriver::getDriver());

# Criando nosso Model.
class User extends Model {
    public ?string $table = "users";
}

# Uso básico
$users = (new User())->select()->get();

print_r($users);
```

## Recomendado

Para uma organização melhor, indicamos você utilizar diferentes arquivos em seu projeto para cada função.

### Configuração

```php
# /path/to/bootstrap.php

# ...

# Obrigatório
# É com este código que o rotyphp identifica qual banco de dados deseja usar
RotyDriver::setName("sqlite");
SQLiteDriver::define(__DIR__."/../database.db");
RotyDatabase::setConnector(RotyDriver::getDriver());

# ...

```

### Model

```php
# /path/to/models/user.php

# ...

# Criando nosso Model.
class User extends Model {
    public ?string $table = "users";
}

# ...

```

### Código

```php
# /path/to/your/code.php

# ...

# Uso básico
$users = (new User())->select()->get();

print_r($users);

# ...

```