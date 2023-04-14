DROP DATABASE IF EXISTS ApiRestForo;

CREATE DATABASE IF NOT EXISTS ApiRestForo;


USE ApiRestForo;
CREATE TABLE users (
    id             int AUTO_INCREMENT not null,
    name            varchar(50) not null,
    surname         varchar(150) not null,
    email           varchar(255) not null,
    password        varchar(255) not null,
    description     text,
    image           varchar(255),
    created_at      DATETIME DEFAULT NULL, 
    update_at       DATETIME DEFAULT NULL, 
    remember_token  varchar(255),
    CONSTRAINT pk_users PRIMARY KEY (id)
)ENGINE=InnoDB;



CREATE TABLE categories (
    id              int AUTO_INCREMENT not null,
    name            varchar(50),
    created_at      DATETIME DEFAULT NULL, 
    update_at       DATETIME DEFAULT NULL, 
    CONSTRAINT pk_categories PRIMARY KEY (id)
)ENGINE=InnoDB;



CREATE TABLE posts (
    id              int AUTO_INCREMENT not null,
    user_id         int not null,
    category_id     int not null,
    title           varchar(255) not null,
    content         text not null,
    image           varchar(255),
    created_at      DATETIME DEFAULT NULL, 
    update_at       DATETIME DEFAULT NULL, 
    CONSTRAINT pk_posts PRIMARY KEY (id),
    CONSTRAINT fk_posts_users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_posts_categories FOREIGN KEY (category_id) REFERENCES categories(id)
)ENGINE=InnoDB;