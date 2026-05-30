# Introdução

O QueryBuilder deste pacote foi pensado para ser simples, explícito e fácil de encadear. Os métodos seguem um prefixo `q_` para diferenciar claramente os métodos “de query” de métodos utilitários e evitar colisões com nomes comuns (por exemplo, `select()`, `where()`, `join()`), especialmente quando o builder é usado dentro de projetos maiores ou junto de outros ORMs.

## Nota sobre segurança

O `WHERE` atual é montado por concatenação e utiliza escape simples para strings. Em cenários reais, prefira sempre execução via prepared statements (PDO) e trate valores como parâmetros.

