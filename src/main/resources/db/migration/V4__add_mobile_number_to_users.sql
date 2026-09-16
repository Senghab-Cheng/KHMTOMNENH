alter table users
    add column if not exists mobile_number varchar(30) not null default '';
