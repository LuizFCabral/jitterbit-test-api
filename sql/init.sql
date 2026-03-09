CREATE TABLE "Order" (
    orderId VARCHAR(50) PRIMARY KEY, 
    value DECIMAL(10, 2) NOT NULL,
    creationDate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de Itens (Items)
CREATE TABLE Items (
    orderId VARCHAR(50) REFERENCES "Order"(orderId) ON DELETE CASCADE,
    productId VARCHAR(50) NOT NULL, -- Também alterado para VARCHAR caso o ID do produto tenha letras
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (orderId, productId) -- Chave primária composta para evitar itens duplicados no mesmo pedido
);