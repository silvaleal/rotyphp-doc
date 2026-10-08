# Quickstart

## Configuração do banco de dados

Antes de usar o RotyPHP, é necessário configurar a conexão com o banco de dados. O RotyPHP suporta SQLite3 e MySQL.

### SQLite3

```php
<?php

require 'vendor/autoload.php';

use RotyPHP\RotyDatabase;
use RotyPHP\RotyDriver;
use RotyPHP\SQLite3\SQLiteDriver;

# Obrigatório
# É com este código que o rotyphp identifica qual banco de dados deseja usar
RotyDriver::setName("sqlite");
SQLiteDriver::define(__DIR__."/../database.db");
RotyDatabase::setConnector(RotyDriver::getDriver());
```

### MySQL

```php
<?php

require 'vendor/autoload.php';

use RotyPHP\MySQL\MySQLDriver;
use RotyPHP\RotyDatabase;
use RotyPHP\RotyDriver;

# Obrigatório
# É com este código que o rotyphp identifica qual banco de dados deseja usar
RotyDriver::setName("mysql");
MySQLDriver::define("localhost", "root", "senha", "meu_banco");
RotyDatabase::setConnector(RotyDriver::getDriver());
```

## Básico

Com o banco de dados configurado, você pode criar seus modelos e começar a usar.

```php
<?php

require 'vendor/autoload.php';

use RotyPHP\Model;

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