# Schemas

O RotyPHP permite construir queries `CREATE TABLE` de forma fluente através das classes de Schema. Escolha a classe correspondente ao banco de dados em uso.

## Criação

```php
<?php

namespace Database\Migrations;

use RotyPHP\SQLite3\SQLiteSchema;

class Users extends SQLiteSchema {
    public string $table = "users";

    public function columns() {
        $this->int('id')->primKey()->autoinc();
        # ...
    }
}
```
