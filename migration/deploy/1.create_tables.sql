BEGIN;

CREATE DOMAIN color AS TEXT CHECK ( VALUE ~ '^#[a-fA-F0-9]{6}$' );
CREATE DOMAIN email as TEXT CHECK( VALUE ~ '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$' );

CREATE TABLE pokemon
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "spe_attack" INTEGER NOT NULL,
    "spe_defense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "sprite" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE type
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "color" color NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE pokemon_type
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "pokemon_id" INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
    "type_id" INTEGER REFERENCES type(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE evolution
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "state" TEXT NOT NULL,
    "evolutionid" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "pokemon_id" INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE weaknessandresist
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "multiplier" NUMERIC NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE type_has_weaknessandresist(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "type_id" INTEGER REFERENCES type(id) ON DELETE CASCADE,
    "typecoverage_id" INTEGER REFERENCES type(id) ON DELETE CASCADE,
    "weaknessandresist_id" INTEGER REFERENCES weaknessandresist(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE role
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user"
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "pseudo" TEXT NOT NULL UNIQUE,
    "email" email NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role_id" INTEGER DEFAULT 2 REFERENCES role(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user_has_pokemon"
(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    "pokemon_id" INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;
