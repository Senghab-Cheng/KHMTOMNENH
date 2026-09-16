create table if not exists companies (
    id bigserial primary key,
    user_id bigint not null references users(id),
    name varchar(255) not null,
    description text,
    email varchar(255),
    phone varchar(30),
    address varchar(500),
    country varchar(100) not null default '',
    city varchar(100) not null default '',
    verification_status varchar(30) not null default 'PENDING',
    created_at timestamp not null default current_timestamp,
    updated_at timestamp
);

create table if not exists products (
    id bigserial primary key,
    company_id bigint not null references companies(id),
    category_id bigint not null,
    name varchar(255) not null,
    description text,
    price numeric(19, 2) not null,
    stock_quantity integer not null default 0,
    active boolean not null default true,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp
);

alter table companies add column if not exists user_id bigint;
alter table companies add column if not exists name varchar(255) not null default '';
alter table companies add column if not exists description text;
alter table companies add column if not exists email varchar(255);
alter table companies add column if not exists phone varchar(30);
alter table companies add column if not exists address varchar(500);
alter table companies add column if not exists country varchar(100) not null default '';
alter table companies add column if not exists city varchar(100) not null default '';
alter table companies add column if not exists verification_status varchar(30) not null default 'PENDING';
alter table companies add column if not exists created_at timestamp not null default current_timestamp;
alter table companies add column if not exists updated_at timestamp;

alter table products add column if not exists company_id bigint;
alter table products add column if not exists category_id bigint;
alter table products add column if not exists name varchar(255) not null default '';
alter table products add column if not exists description text;
alter table products add column if not exists price numeric(19, 2) not null default 0;
alter table products add column if not exists stock_quantity integer not null default 0;
alter table products add column if not exists active boolean not null default true;
alter table products add column if not exists created_at timestamp not null default current_timestamp;
alter table products add column if not exists updated_at timestamp;

create index if not exists idx_companies_user_id on companies(user_id);
create index if not exists idx_products_company_id on products(company_id);
