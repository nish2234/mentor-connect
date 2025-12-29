-- MentorConnect Database Schema
-- Run this script in Aiven MySQL console to manually create all tables

-- ============================================
-- 1. USERS TABLE (Base user table)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL CHECK (role IN ('MENTOR', 'MENTEE')),
    created_at DATETIME,
    updated_at DATETIME,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. MENTOR PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    whatsapp_number VARCHAR(50) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    passout_year INT NOT NULL,
    current_company VARCHAR(255) NOT NULL,
    experience_type VARCHAR(20) NOT NULL CHECK (experience_type IN ('FULLTIME', 'INTERNSHIP', 'BOTH')),
    bio TEXT,
    linkedin_url VARCHAR(500),
    profile_image_url VARCHAR(500),
    session_price DECIMAL(10, 2) NOT NULL,
    session_duration INT DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. MENTOR SKILLS TABLE (ElementCollection)
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_skills (
    mentor_id BIGINT NOT NULL,
    skill VARCHAR(255),
    FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    INDEX idx_mentor_id (mentor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. MENTOR PREVIOUS COMPANIES TABLE (ElementCollection)
-- ============================================
CREATE TABLE IF NOT EXISTS mentor_previous_companies (
    mentor_id BIGINT NOT NULL,
    company_name VARCHAR(255),
    FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    INDEX idx_mentor_id (mentor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. AVAILABILITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS availabilities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    INDEX idx_mentor_id (mentor_id),
    INDEX idx_day_of_week (day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT NOT NULL,
    mentee_id BIGINT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration INT NOT NULL DEFAULT 30,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    meeting_link VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(id) ON DELETE RESTRICT,
    FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_mentor_id (mentor_id),
    INDEX idx_mentee_id (mentee_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduled_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    transaction_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    payment_method VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT,
    INDEX idx_booking_id (booking_id),
    INDEX idx_status (status),
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after creating tables to verify:

-- Check all tables were created:
SHOW TABLES;

-- Verify table structures:
-- DESCRIBE users;
-- DESCRIBE mentor_profiles;
-- DESCRIBE mentor_skills;
-- DESCRIBE mentor_previous_companies;
-- DESCRIBE availabilities;
-- DESCRIBE bookings;
-- DESCRIBE payments;

-- Check foreign key constraints:
-- SELECT * FROM information_schema.TABLE_CONSTRAINTS 
-- WHERE CONSTRAINT_SCHEMA = 'defaultdb' AND CONSTRAINT_TYPE = 'FOREIGN KEY';
