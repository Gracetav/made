CREATE DATABASE IF NOT EXISTS jaya_motospart;
USE jaya_motospart;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  description TEXT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  invoice_number VARCHAR(60) NOT NULL UNIQUE,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('akan dikemas', 'sedang dikemas', 'siap diambil', 'confirmed') NOT NULL DEFAULT 'akan dikemas',
  payment_status ENUM('pending', 'confirmed', 'rejected') NOT NULL DEFAULT 'pending',
  payment_proof VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  qty INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users (name, email, password, role) VALUES
('Admin Jaya', 'admin@jaya.com', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO products (name, price, stock, description, image) VALUES
('Brake Pad Racing', 250000, 25, 'Kampas rem performa tinggi untuk motor harian dan balap.', NULL),
('Chain Set 428', 420000, 18, 'Rantai dan gear set awet untuk touring jarak jauh.', NULL),
('LED Headlamp Pro', 180000, 45, 'Lampu LED terang dan hemat daya.', NULL);

-- Jika database sudah terlanjur dibuat dengan enum status lama,
-- jalankan ALTER berikut sekali saja:
ALTER TABLE orders
  MODIFY COLUMN status ENUM('akan dikemas', 'sedang dikemas', 'siap diambil', 'confirmed')
  NOT NULL DEFAULT 'akan dikemas';
