# Uso básico
## Criação
```php
<?php
# /path/to/migrations/users.php

use RotyPHP\SQLite3\SQLiteMigration;

# Criando nossa Migration.
class Courses extends SQLiteMigration {
    public string $table = "courses";

    public function columns() {
        $this->int('id')->primKey()->autoinc();
        $this->bigint('uniqueid');
        $this->text('name');
        $this->int('teacherId');
    }
}
```


## Métodos
- `varchar(string $column, int $length)`
- `text(string $column)`
- `int(string $column)`
- `bigint(string $column)`
- `float(string $column)`
- `bool(string $column)`
- `default(string $value)`
- `primKey()`
- `autoinc()`