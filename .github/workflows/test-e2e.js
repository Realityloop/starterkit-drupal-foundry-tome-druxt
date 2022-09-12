name: test-e2e

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  ci:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [ubuntu-latest]
        node: [16]
        steps:
        - name: Checkout 🛎
          uses: actions/checkout@master

        - name: Setup node env 🏗
          uses: actions/setup-node@v3.4.1
          with:
            node-version: ${{ matrix.node }}
            check-latest: true

        - name: Get yarn cache directory path 🛠
          id: yarn-cache-dir-path
          run: cd nuxt && echo "::set-output name=dir::$(yarn cache dir)"

        - name: Cache node_modules 📦
          uses: actions/cache@v3.0.8
          id: yarn-cache # use this to check for `cache-hit` (`steps.yarn-cache.outputs.cache-hit != 'true'`)
          with:
            path: ${{ steps.yarn-cache-dir-path.outputs.dir }}
            key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
            restore-keys: |
              ${{ runner.os }}-yarn-
        - name: Setup ddev
          uses: jonaseberle/github-action-setup-ddev@v1
          with:
            autostart: false
        - name: Start ddev
          run: cd drupal && ddev start

        - name: Install Drupal 👨🏻‍💻
          run: cd drupal && ddev drupal-install

        - name: Install Nuxt.js 👨🏻‍💻
          run: cd nuxt && npm i

        // - name: Run linting 🔎
        //   run: cd nuxt && yarn lint

        // - name: Run Jest tests 🧪
        //   run: cd nuxt && yarn test:jest

        // - name: Run Cypress tests 🧪
        //   run: cd nuxt && NODE_TLS_REJECT_UNAUTHORIZED=0 yarn test:cy
