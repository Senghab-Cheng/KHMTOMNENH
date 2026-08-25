create table if not exists users (
    id bigserial primary key,
    full_name varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    role varchar(20) not null,
    enabled boolean not null default true,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp null
);
