CREATE TABLE IF NOT EXISTS imoveis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  endereco VARCHAR(255),
  imagem VARCHAR(255),
  tipo VARCHAR(50),
  area DECIMAL(10, 2),
  quartos INT,
  banheiros INT,
  vagas INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir alguns dados de exemplo
INSERT INTO imoveis (titulo, descricao, preco, endereco, imagem, tipo, area, quartos, banheiros, vagas) VALUES
('Casa Moderna no Centro', 'Linda casa moderna com acabamento de luxo e área gourmet', 850000.00, 'Rua das Flores, 123', '/images/casa1.jpg', 'Casa', 180.00, 3, 2, 2),
('Apartamento com Vista para o Mar', 'Apartamento espaçoso com vista panorâmica para o mar', 650000.00, 'Av. Beira Mar, 456', '/images/apto1.jpg', 'Apartamento', 120.00, 2, 2, 1),
('Cobertura Duplex', 'Cobertura duplex com terraço e churrasqueira', 1200000.00, 'Rua dos Jardins, 789', '/images/cobertura1.jpg', 'Cobertura', 250.00, 4, 3, 3);
