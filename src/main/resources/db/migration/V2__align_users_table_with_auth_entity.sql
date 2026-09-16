alter table users
    add column if not exists enabled boolean not null default true;

alter table users
    add column if not exists created_at timestamp not null default current_timestamp;

alter table users
    add column if not exists updated_at timestamp null;
