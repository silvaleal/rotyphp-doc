# Model

Os modelos são as classes que instanciamos para realizar operações em uma tabela específica.

## Criação

```php
<?php
# /path/to/models/user.php

use RotyPHP\Model;

# Criando nosso Model.
class User extends Model
{
    public ?string $table = 'users';
}

$users = (new User)->getAll();
```