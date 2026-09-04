-- 사용자 테이블
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  password_hash text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- 상품 테이블
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price integer not null check (price >= 0),
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz default now()
);

-- 예약 테이블
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  note text,
  created_at timestamptz default now()
);

-- 예약 항목 테이블
create table if not exists reservation_items (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references reservations(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null check (quantity > 0)
);

-- RLS 비활성화 (service_role 키로만 접근)
alter table users disable row level security;
alter table products disable row level security;
alter table reservations disable row level security;
alter table reservation_items disable row level security;

-- 관리자 계정 생성 예시 (비밀번호는 앱에서 bcrypt로 해시해서 직접 INSERT)
-- insert into users (name, phone, password_hash, role) values ('관리자', '01000000000', '$2a$10$...', 'admin');
