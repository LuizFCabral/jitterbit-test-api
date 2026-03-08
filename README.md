# Jitterbit Test api
Este é um repositório que contempla um teste feito para o processo seletivo da empresa Jitterbit

Esta é uma API básica construída com Node.js e PostgreSQL para o gerenciamento de pedidos e itens.

---

## 🛠️ Tecnologias
* Node.js (v24+)

* PostgreSQL (Banco de Dados Relacional)

* Express (Framework Web)

* Swagger Autogen (Documentação Automática)

---

## 🗄️ Estrutura do Banco de Dados
Para inicializar o banco de dados, execute os comandos SQL abaixo. O script cria a tabela de pedidos (Order) e a tabela de itens relacionados (Items), garantindo a integridade dos dados com chaves estrangeiras.

```SQL

-- Criação da tabela de Pedidos
CREATE TABLE "Order" (
    orderId SERIAL PRIMARY KEY,
    value DECIMAL(10, 2) NOT NULL,
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de Itens
CREATE TABLE Items (
    orderId INTEGER REFERENCES "Order"(orderId) ON DELETE CASCADE,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (orderId, productId)
);
```

---

⚙️ Configuração do Ambiente
Instale as dependências:

```Bash
npm install
```

Configure as Variáveis de Ambiente:
Crie um arquivo ``.env`` na raiz do projeto e adicione sua string de conexão e também coloque a porta em que a API irá rodar:

Exemplo:
```
PORT=3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
```


Gere a Documentação Swagger:

```Bash
npm run swagger-gen
```

--- 

## 🚀 Como Executar
Para rodar o projeto em modo de desenvolvimento com atualização automática:

```Bash
npm run dev
```

A API estará disponível em http://localhost:3000. Você pode acessar a documentação interativa em http://localhost:3000/api-doc.

---

## 📝 Scripts Disponíveis
* ```npm start```: Inicia o servidor.
* ```npm swagger-autogen```: Atualiza a documentação

