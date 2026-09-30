-- ===================================================================
-- Tarkhineh backend - MySQL schema
-- Charset utf8mb4 everywhere because the app is fully in Persian.
--
-- IMPORTANT: import this with a UTF-8 client, e.g.:
--   mysql -u root --default-character-set=utf8mb4 < schema.sql
-- Otherwise the mysql CLI defaults to latin1 and every Persian
-- string inserted later gets double-encoded (mojibake).
-- ===================================================================
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS tarkhineh
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tarkhineh;

-- -------------------------------------------------------------
-- Users (auth is phone + OTP, like the React AuthModal expects)
-- -------------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  phone         VARCHAR(11)  NOT NULL UNIQUE,
  full_name     VARCHAR(150) NULL,
  display_name  VARCHAR(150) NULL,
  email         VARCHAR(150) NULL,
  birth_date    DATE NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- One-time-passwords sent to a phone number during login/register
CREATE TABLE otp_codes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  phone       VARCHAR(11) NOT NULL,
  code        CHAR(5) NOT NULL,
  expires_at  DATETIME NOT NULL,
  is_used     TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_otp_phone (phone)
) ENGINE=InnoDB;

-- Simple bearer tokens instead of PHP sessions, so the React SPA
-- can send "Authorization: Bearer <token>" like a normal REST API.
CREATE TABLE auth_tokens (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  token       CHAR(64) NOT NULL UNIQUE,
  expires_at  DATETIME NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Branches (src/data/branches.js)
-- -------------------------------------------------------------
CREATE TABLE branches (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug           VARCHAR(100) NOT NULL UNIQUE,
  name           VARCHAR(150) NOT NULL,
  address        VARCHAR(500) NOT NULL,
  phone1         VARCHAR(100) NULL,
  phone2         VARCHAR(100) NULL,
  working_hours  VARCHAR(200) NULL,
  lat            DECIMAL(10,7) NULL,
  lng            DECIMAL(10,7) NULL,
  image          VARCHAR(255) NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE branch_images (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  branch_id   INT UNSIGNED NOT NULL,
  image_url   VARCHAR(255) NOT NULL,
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT fk_branch_images_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Menu (src/data/menuItems.js)
-- -------------------------------------------------------------
CREATE TABLE menu_tabs (
  id          VARCHAR(30) PRIMARY KEY,   -- 'main' | 'appetizer' | 'dessert' | 'drink'
  label       VARCHAR(100) NOT NULL,
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE menu_items (
  id                VARCHAR(60) PRIMARY KEY,   -- keeps the same slug-ids the React app already uses ('m-koofte-berenji')
  tab_id            VARCHAR(30) NOT NULL,
  title             VARCHAR(150) NOT NULL,
  description       TEXT NULL,
  price             INT UNSIGNED NOT NULL,      -- Toman, plain integer (frontend formats it)
  old_price         INT UNSIGNED NULL,
  discount_percent  TINYINT UNSIGNED NULL,
  rating            DECIMAL(2,1) NOT NULL DEFAULT 0,
  rating_count      INT UNSIGNED NOT NULL DEFAULT 0,
  image             VARCHAR(255) NULL,
  category          VARCHAR(50) NULL,           -- e.g. 'iranian'
  category_label    VARCHAR(100) NULL,          -- e.g. 'غذاهای ایرانی'
  is_bestseller     TINYINT(1) NOT NULL DEFAULT 0,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_menu_items_tab FOREIGN KEY (tab_id) REFERENCES menu_tabs(id),
  INDEX idx_menu_items_tab (tab_id),
  FULLTEXT INDEX ft_menu_items_title (title, description)
) ENGINE=InnoDB;

CREATE TABLE menu_item_images (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  menu_item_id  VARCHAR(60) NOT NULL,
  image_url     VARCHAR(255) NOT NULL,
  sort_order    INT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT fk_menu_item_images_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Branch dishes (src/data/branchDishes.js) - featured/popular/nonIranian
-- rows per branch, so each branch CAN have its own dishes later.
-- -------------------------------------------------------------
CREATE TABLE branch_dishes (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  branch_id         INT UNSIGNED NOT NULL,
  section           ENUM('featured','popular','non_iranian') NOT NULL,
  name              VARCHAR(150) NOT NULL,
  price             INT UNSIGNED NOT NULL,
  discount_percent  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  rating            DECIMAL(2,1) NOT NULL DEFAULT 0,
  rating_count      INT UNSIGNED NOT NULL DEFAULT 0,
  image             VARCHAR(255) NULL,
  sort_order        INT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT fk_branch_dishes_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
  INDEX idx_branch_dishes_branch_section (branch_id, section)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Reviews (src/data/review.js) - per branch
-- -------------------------------------------------------------
CREATE TABLE reviews (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  branch_id    INT UNSIGNED NOT NULL,
  name         VARCHAR(150) NOT NULL,
  review_date  VARCHAR(50) NULL,     -- kept as a Persian date string, same as the mock ("۲۳ اسفند ۱۴۰۱")
  text         TEXT NOT NULL,
  rating       TINYINT UNSIGNED NOT NULL,
  avatar       VARCHAR(255) NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Addresses (AddAddressModal.jsx)
-- -------------------------------------------------------------
CREATE TABLE addresses (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL,
  label           VARCHAR(100) NOT NULL,      -- 'خانه' / 'محل کار' / ...
  phone           VARCHAR(20) NULL,
  full_address    VARCHAR(500) NOT NULL,
  is_self         TINYINT(1) NOT NULL DEFAULT 1,
  recipient_name  VARCHAR(150) NULL,
  lat             DECIMAL(10,7) NULL,
  lng             DECIMAL(10,7) NULL,
  is_default      TINYINT(1) NOT NULL DEFAULT 0,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Discount codes (PaymentPage.jsx "ثبت کد تخفیف")
-- -------------------------------------------------------------
CREATE TABLE discount_codes (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(50) NOT NULL UNIQUE,
  percent       TINYINT UNSIGNED NULL,     -- percentage discount, e.g. 10 = 10%
  amount        INT UNSIGNED NULL,         -- flat Toman discount, alternative to percent
  max_discount  INT UNSIGNED NULL,         -- cap for percent-based codes
  expires_at    DATE NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Orders (CheckoutInfoPage.jsx + PaymentPage.jsx + ProfilePage.jsx orders tab)
-- -------------------------------------------------------------
CREATE TABLE orders (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id               INT UNSIGNED NOT NULL,
  branch_id             INT UNSIGNED NULL,
  address_id            INT UNSIGNED NULL,
  delivery_type         ENUM('courier','pickup') NOT NULL DEFAULT 'courier',
  note                  TEXT NULL,
  status                ENUM('active','delivered','cancelled') NOT NULL DEFAULT 'active',
  subtotal              INT UNSIGNED NOT NULL DEFAULT 0,
  discount_total        INT UNSIGNED NOT NULL DEFAULT 0,
  shipping_cost         INT UNSIGNED NOT NULL DEFAULT 0,
  discount_code         VARCHAR(50) NULL,
  discount_code_amount  INT UNSIGNED NOT NULL DEFAULT 0,
  total                 INT UNSIGNED NOT NULL DEFAULT 0,
  payment_method        ENUM('online','cod') NOT NULL DEFAULT 'online',
  payment_gateway       VARCHAR(30) NULL,
  payment_status        ENUM('pending','paid','failed') NOT NULL DEFAULT 'pending',
  tracking_code         VARCHAR(50) NULL,
  delivery_estimate     VARCHAR(50) NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_orders_branch  FOREIGN KEY (branch_id)  REFERENCES branches(id) ON DELETE SET NULL,
  CONSTRAINT fk_orders_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL,
  INDEX idx_orders_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id      INT UNSIGNED NOT NULL,
  menu_item_id  VARCHAR(60) NULL,     -- snapshot: kept nullable in case the dish is removed later
  name          VARCHAR(150) NOT NULL,
  price         INT UNSIGNED NOT NULL,
  qty           INT UNSIGNED NOT NULL DEFAULT 1,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Wishlist / favorites (ProfilePage.jsx "علاقه‌مندی‌ها")
-- -------------------------------------------------------------
CREATE TABLE wishlist (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL,
  menu_item_id  VARCHAR(60) NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_wishlist_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  UNIQUE KEY uq_wishlist_user_item (user_id, menu_item_id)
) ENGINE=InnoDB;
