
-- 1. Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    balance NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Транзакции
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bonus')),
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed','failed')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Игры
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    min_bet NUMERIC(10,2) DEFAULT 1,
    max_bet NUMERIC(10,2) DEFAULT 1000,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Ставки
CREATE TABLE bets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    result VARCHAR(10) CHECK (result IN ('win','lose','draw')),
    payout NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Сессии (опционально)
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (username, email, password_hash, balance, last_login)
VALUES
('luckyLion', 'lion@example.com', 'hash1', 250.00, NOW()),
('goldenCat', 'cat@example.com', 'hash2', 120.50, NOW()),
('crazyFox', 'fox@example.com', 'hash3', 890.75, NOW()),
('silverWolf', 'wolf@example.com', 'hash4', 35.20, NOW()),
('joker777', 'joker@example.com', 'hash5', 1045.00, NOW()),
('queenBee', 'bee@example.com', 'hash6', 312.00, NOW()),
('luckyDuck', 'duck@example.com', 'hash7', 560.40, NOW()),
('sharkKing', 'shark@example.com', 'hash8', 970.00, NOW()),
('magicMike', 'mike@example.com', 'hash9', 150.00, NOW()),
('ironHorse', 'horse@example.com', 'hash10', 77.77, NOW()),
('redDragon', 'dragon@example.com', 'hash11', 480.00, NOW()),
('spaceAce', 'ace@example.com', 'hash12', 260.00, NOW()),
('blackJack', 'blackjack@example.com', 'hash13', 999.99, NOW()),
('vegasQueen', 'vegas@example.com', 'hash14', 430.10, NOW()),
('betMaster', 'betmaster@example.com', 'hash15', 830.00, NOW());

INSERT INTO games (name, description, min_bet, max_bet)
VALUES
('Roulette', 'European roulette with single zero', 1, 500),
('Blackjack', 'Classic 21 game', 5, 1000),
('Poker', 'Texas Holdem poker table', 10, 2000),
('Slot Machine', '3x3 slot machine with wilds', 0.5, 200),
('Dice', 'Simple dice roll betting game', 1, 100),
('Crash', 'Multiplier-based crash game', 1, 1000),
('Coin Flip', 'Heads or tails coin flip', 1, 300),
('Wheel of Fortune', 'Spin the big wheel', 2, 500),
('Baccarat', 'Classic casino card game', 10, 1000),
('Keno', 'Number selection lottery-style game', 1, 100),
('Plinko', 'Peg board dropping ball game', 1, 200),
('Mines', 'Find safe cells and avoid bombs', 1, 500),
('Aviator', 'Plane crash multiplier game', 1, 1000),
('Craps', 'Dice-based table game', 5, 1000),
('Lucky Cards', 'Pick lucky cards to win', 2, 300);

INSERT INTO transactions (user_id, type, amount, status)
VALUES
(1, 'deposit', 200, 'completed'),
(2, 'deposit', 100, 'completed'),
(3, 'withdrawal', 50, 'completed'),
(4, 'bonus', 10, 'completed'),
(5, 'deposit', 500, 'completed'),
(6, 'withdrawal', 100, 'pending'),
(7, 'deposit', 200, 'completed'),
(8, 'bonus', 20, 'completed'),
(9, 'deposit', 150, 'completed'),
(10, 'withdrawal', 50, 'completed'),
(11, 'deposit', 300, 'completed'),
(12, 'deposit', 100, 'completed'),
(13, 'withdrawal', 80, 'completed'),
(14, 'deposit', 400, 'completed'),
(15, 'bonus', 25, 'completed');

INSERT INTO bets (user_id, game_id, amount, result, payout)
VALUES
(1, 1, 20, 'win', 40),
(1, 4, 5, 'lose', 0),
(2, 2, 10, 'win', 20),
(3, 5, 5, 'lose', 0),
(4, 3, 25, 'lose', 0),
(5, 1, 50, 'win', 100),
(6, 7, 10, 'draw', 10),
(7, 8, 15, 'lose', 0),
(8, 9, 30, 'win', 60),
(9, 10, 5, 'lose', 0),
(10, 11, 7, 'win', 14),
(11, 12, 3, 'win', 6),
(12, 13, 8, 'lose', 0),
(13, 14, 20, 'win', 40),
(14, 15, 10, 'lose', 0),
(15, 6, 50, 'win', 150);

INSERT INTO sessions (user_id, token, expires_at)
VALUES
(1, 'tok_aaa111', NOW() + INTERVAL '7 days'),
(2, 'tok_bbb222', NOW() + INTERVAL '7 days'),
(3, 'tok_ccc333', NOW() + INTERVAL '7 days'),
(4, 'tok_ddd444', NOW() + INTERVAL '7 days'),
(5, 'tok_eee555', NOW() + INTERVAL '7 days'),
(6, 'tok_fff666', NOW() + INTERVAL '7 days'),
(7, 'tok_ggg777', NOW() + INTERVAL '7 days'),
(8, 'tok_hhh888', NOW() + INTERVAL '7 days'),
(9, 'tok_iii999', NOW() + INTERVAL '7 days'),
(10, 'tok_jjj000', NOW() + INTERVAL '7 days'),
(11, 'tok_kkk111', NOW() + INTERVAL '7 days'),
(12, 'tok_lll222', NOW() + INTERVAL '7 days'),
(13, 'tok_mmm333', NOW() + INTERVAL '7 days'),
(14, 'tok_nnn444', NOW() + INTERVAL '7 days'),
(15, 'tok_ooo555', NOW() + INTERVAL '7 days');

-- 1. Создаём функцию-триггер
CREATE OR REPLACE FUNCTION set_default_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.balance IS NULL THEN
        NEW.balance := 50.00;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Создаём триггер на таблице users
CREATE TRIGGER trigger_set_default_balance
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_default_balance();