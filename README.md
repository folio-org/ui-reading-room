# ui-reading-room

Copyright (C) 2023 The Open Library Foundation

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction
The `ui-reading-room` module facilitates the verification of patron access to the reading room, ensuring that staff users can efficiently manage and track patron privileges and access permissions.

## Prerequisites

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (at least version 8)
* [Yarn](https://yarnpkg.com/)

## Installation

* `git clone https://github.com/folio-org/ui-reading-room`
* `cd ui-reading-room`
* `yarn`

## Running

* `yarn start`
* Visit your app at [http://localhost:3000](http://localhost:3000).

By default, this will use the backend OKAPI cluster at
http://localhost:9130

If you want to run the application against the mirage server contained
within the browser, you can turn it on with the `--mirage` option:

* `yarn start --mirage`

If you want to run the application against a different Okapi cluster:

* `yarn start --okapi https://myokapi.cluster.folio.org`
```

## Running Tests

* `yarn test` (uses RTL and Jest to test the application)

To add code coverage report:
* `yarn test --coverage`
```

## Building

* `yarn build`

