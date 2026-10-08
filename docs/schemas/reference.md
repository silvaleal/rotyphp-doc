# Referência

Os métodos de Schema são encadeáveis e usados dentro do método `columns()` da sua classe para descrever as colunas da tabela. Escolha a classe de base de acordo com o banco de dados:

- SQLite3: `RotyPHP\SQLite3\SQLiteSchema`
- MySQL: `RotyPHP\MySQL\MySQLSchema`

## varchar

Cria uma coluna do tipo `VARCHAR` com tamanho máximo definido.

### Assinatura

```php
public function varchar(string $column, int $length)
```

### Exemplo

```php
$this->varchar("name", 100);
$this->varchar("email", 150)->unique();
```

## text

Cria uma coluna do tipo `TEXT`.

### Assinatura

```php
public function text(string $column)
```

### Exemplo

```php
$this->text("bio");
```

## int

Cria uma coluna do tipo `INTEGER`.

### Assinatura

```php
public function int(string $column)
```

### Exemplo

```php
$this->int("age");
```

## bigint

Cria uma coluna do tipo `BIGINT`.

### Assinatura

```php
public function bigint(string $column)
```

### Exemplo

```php
$this->bigint("views");
```

## float

Cria uma coluna do tipo `FLOAT`.

### Assinatura

```php
public function float(string $column)
```

### Exemplo

```php
$this->float("price");
```

## bool

Cria uma coluna do tipo `BOOLEAN`.

### Assinatura

```php
public function bool(string $column)
```

### Exemplo

```php
$this->bool("active");
```

## datetime

Cria uma coluna do tipo `DATETIME`.

### Assinatura

```php
public function datetime(string $column)
```

### Exemplo

```php
$this->datetime("created_at");
```

## primKey

Define a coluna como chave primária.

### Assinatura

```php
public function primKey()
```

### Exemplo

```php
$this->int("id")->primKey();
```

## autoinc

Aplica auto incremento na coluna.

### Assinatura

```php
public function autoinc()
```

### Exemplo

```php
$this->int("id")->primKey()->autoinc();
```

### Observações

O SQL gerado varia conforme o banco de dados:

- SQLite3: `AUTOINCREMENT`
- MySQL: `AUTO_INCREMENT`

## unique

Adiciona a restrição `UNIQUE` à coluna.

### Assinatura

```php
public function unique()
```

### Exemplo

```php
$this->varchar("email", 150)->unique();
```

## default

Define um valor padrão para a coluna.

### Assinatura

```php
public function default(string $value)
```

### Exemplo

```php
$this->varchar("status", 20)->default("active");
```

## defaultRaw

Define um valor padrão a partir de uma expressão SQL crua (sem aspas).

### Assinatura

```php
public function defaultRaw(string $expression)
```

### Exemplo

```php
$this->datetime("created_at")->defaultRaw("CURRENT_TIMESTAMP");
```

## foreignkey

Adiciona uma chave estrangeira referenciando uma coluna de outra tabela.

### Assinatura

```php
public function foreignkey(string $column, string $table, string $key)
```

### Exemplo

```php
$this->int("user_id")->foreignkey("user_id", "users", "id");
```

## build

Monta e retorna a query `CREATE TABLE` completa.

### Assinatura

```php
public function build()
```

### Exemplo

```php
class Users extends SQLiteSchema {
    public string $table = "users";

    public function columns() {
        $this->int("id")->primKey()->autoinc();
        $this->varchar("name", 100);
    }
}

$schema = new Users();
$schema->columns();

echo $schema->build();
// CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100))
```
