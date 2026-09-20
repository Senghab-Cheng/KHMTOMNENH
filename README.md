# KHMTOMNENH

## Run locally

Start the web application from the repository root:

```bash
npm run dev
```

Open http://localhost:3000. The frontend is intentionally started from the
`frontend` directory by the root script, so `npm run dev` works without
changing directories.

Start the Spring Boot API in a second terminal when authentication or other
API features are needed:

```bash
export DB_USERNAME=your_database_username
export DB_PASSWORD=your_database_password
export JWT_SECRET="$(openssl rand -base64 48)"
npm run backend
```

The API listens on http://localhost:8080. A PostgreSQL database named `khmertrade` must be running locally for the
backend to start successfully. The application uses the `public` schema;
authentication records are stored in `public.users`, while product records
belong in `public.products`.

The backend reads database credentials and the JWT signing secret from
environment variables. Do not commit those values.

Run the backend verification suite without PostgreSQL:

```bash
./gradlew test
```

Tests use an isolated in-memory H2 database and verify persistence,
registration, login, JWT-protected access, and role authorization. For live
PostgreSQL verification, start PostgreSQL with a `khmertrade` database, set
the environment variables above, and run `npm run backend`.
