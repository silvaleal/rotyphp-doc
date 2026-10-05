# Uso básico
## Criação

```php
<?php

namespace Database\Migrations;

use RotyPHP\MySQL\MySQLSchema;
use RotyPHP\SQLite3\SQLiteSchema; 
 
class Users extends SQLiteSchema {
    public string $table = "users";
 
    public function columns() {
        $this->int('id')->primKey()->autoinc();
        # ...
    }
}
```