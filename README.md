# Spirii - Backend Software Developer Challenge

[Kevin Østerkilde](https://www.oesterkilde.dk/?utm_source=github&utm_medium=readme&utm_campaign=spirii) | [LinkedIn](https://linkedin.com/in/oesterkilde)

---

## Preface

I have never worked with Nestjs before, but I took a chance and gave it a shot. Because I only had 4 hours for this test, there's a lot of things I didn't have time to pick up and understand properly, such as middleware, validation, error handling and such.

## Approach

### Getting started

I've used [PNPM](https://pnpm.io/) for this project but it should run fine using other package managers as well.

The project runs on `localhost:3000` by default.

```sh
pnpm i

# Commands
pnpm run dev
pnpm run test
pnpm run type-check
pnpm run lint # Configured incorrectly and I din't have time to resolve it
```

### Project Structure

I bootstrapped the project using [Turborepo](https://turborepo.com/) using their [Nestjs example](https://github.com/vercel/turborepo/tree/main/examples/with-nestjs), which explains a few of the initial commits + a few of mine where I delete some boilerplate.

#### APPS

- `/apps/transaction` Microservice which handles transactions
- `/apps/aggregation` Microservice which handles aggregations
- `/apps/api` API gateway which exposes the following endpoints:

| Resource         | Endpoint                                                |
| :--------------- | :------------------------------------------------------ |
| **Transactions** | `/transactions`                                         |
|                  | `/transactions?startDate=2023-01-01&endDate=2023-02-31` |
|                  | `/transactions?limit=10&page=2`                         |
| **Aggregations** | `/aggregations`                                         |
|                  | `/aggregations/user/:userId`                            |
|                  | `/aggregations/payouts/pending`                         |

I would've created a [Postman](https://www.postman.com/) collection or [Swagger](https://swagger.io/) docs if I had more time.

#### PACKAGES

Under the `/packages/*` you'll see some boilerplate packages for ESLint, Jest and TypeScript configs. There's also a directory called `api` which contains some shared code for the API service.

I forgot to utilize this package fully but there's some base entity and DTO types here.

### Development + Code

Since I hadn't worked with Nestjs before, I took a moment to familiarize myself with the docs and the boilerplate code. Due to the time constrains, I didn't get far in the documentation (I will read up on this after the 4 hours) hence why you don't see me handle things like middleware, logging, error handling and so forth properly.

I started off basing my code off of the initial boilerplate and then work on it from there. I only used AI once in this project, just to generate some more dummy data variants: `/apps/api/src/transactions/transactions.mock.ts` to give me some more data to experiment with.

### Testing

The tests I have are quite straight forward, nothing amazing, and my controllers and services practically do the same thing, so the tests here are almost identical. Other than that, I tried to make sure to test the "happy paths" as well as some error cases.

The tests themselves could be structured better but for the sake of the assignment, simple approaches are more manageable.

## Final words

Overall, a fun exercise. I've been meaning to give Nestjs and other JS frameworks a try and I think I'll give it a more serious try on a side project when I get some time.

I look forward to discussing my approach with you soon.

Thanks,

Kevin Østerkilde
[www.oesterkilde.dk](https://www.oesterkilde.dk/?utm_source=github&utm_medium=readme&utm_campaign=spirii)