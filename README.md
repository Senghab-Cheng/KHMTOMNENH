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
npm run backend
```

The API listens on http://localhost:8080. A PostgreSQL database named `khmertrade` must be running locally for the
backend to start successfully. The application uses the `public` schema;
authentication records are stored in `public.users`, while product records
belong in `public.products`.
