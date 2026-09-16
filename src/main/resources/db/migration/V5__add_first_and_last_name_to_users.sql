alter table users
    add column if not exists first_name varchar(255) not null default '';

alter table users
    add column if not exists last_name varchar(255) not null default '';
