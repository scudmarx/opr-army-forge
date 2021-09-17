# One Page Rules - Army Forge

This is a community list builder application specific to the One Page Rules games. Army lists are driven by data from the `public/definitions` directory.

- Select Game System
- Select Army List
- Add Units to list
   - TODO Apply upgrades to units
   - TODO Upgrade validation
- TODO Save List (locally)
- TODO Load existing List

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Clone the repository, install dependencies with `npm i`, then run the development server with `npm run dev`.

There are no database or API dependencies so the project will run locally.

## Authoring Data Files

Data files can be found in the `public/definitions` directory. There is a JSON schema provided, but the best way to author these will be to start with the pdf parsing tool. This tool can be found by running the application and browsing to `http://localhost:3000/data`.

TODO Explanation