## Contract: Greeting

*This contract is part of a workshop on AssemblyScript*

### Interface

- `sayMyName(): string`
  This is a `view` function that returns transaction signer's account name
  and appends to the log.

- `saveMyName(): void`
  This is a `call` function that saves the transaction signer's account name
  to storage and appends to the log.  The function returns nothing.


### Models

This contract has no models


### Testing

See `package.json` for testing scripts.  The following command in your console.

#### Unit Tests

`yarn run test:1:unit:contract -f A.scavenger-hunt/01.greeting`

#### Simulation Tests

`yarn run test:1:unit:contract -f A.scavenger-hunt/01.greeting`

#### Integration Tests