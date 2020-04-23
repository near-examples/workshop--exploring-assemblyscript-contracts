![Near, Inc. logo](https://nearprotocol.com/wp-content/themes/near-19/assets/img/logo.svg?t=1553011311)

# NEAR Protocol Workshop :: Exploring AssemblyScript Contracts

This workshop includes several activities: 
- a **scavenger hunt** through several AssemblyScript contracts to get you quickly oriented
- a **debugging challenge** to fix several problems with broken contracts
- a **design challenge** to create new contracts and related models that satisfy a set of requirements

**Prerequisites**

If you're already comfortable with TypeScript then reading AssemblyScript should be a breeze.  If you're coming from JavaScript, you'll have to get your head around `types` (since JavaScript doesn't have them) but reading through the samples here should not be too difficult.  If you have no programming experience then this workshop will be challenging for you -- find someone to pair with so you can stay motivated and productive.

**Orientation**

If you're totally new to NEAR you can [start here](https://docs.nearprotocol.com/docs/quick-start/new-to-near) with a high level overview.

NEAR Protocol (aka "NEAR") is a public peer-to-peer key-value database. Public as in open to everyone for read anything and write what you are allowed to. The write permissions are defined by the access keys, so only the owner of the data can give permissions to modify the data they own.

The data manipulation gets defined by stored procedures (smart contracts) in [Wasm](https://webassembly.org), which means that those can be implemented in any programming language compilable to Wasm (e.g. Rust, AssemblyScript, Kotlin, C, C++, Nim, Zig, etc).

This workshop focuses on AssemblyScript as one of two currently supported languages for contract development.

*We will not be deploying any of these contracts to the network since our focus is on learning AssemblyScript and almost all of the code presented in this workshop is also running on [live examples](https://examples.nearprotocol.com) where you will also find the frontend code that relies on these contracts.*

## Environment Setup

1. clone this repo locally (or open using Gitpod)
2. run `yarn` to install dependencies
3. run `yarn test` to run tests
4. run `yarn build` to build contracts
5. run `yarn mock` to deploy contracts to a local mock virtual machine for testing

See `package.json` for more detail about these scripts.

You will find the following folder structure in this repository under the `assembly` folder.

```bash
assembly
│
├── A.scavenger-hunt
│   ├── 01.greeting
│   ├── 02.wallet-example
│   ├── 03.counter
│   ├── 04.token-contract
│   ├── 05.guestbook
│   └── 06.chat
│
├── B.debugging-challenge
│   ├── 01.broken-greeting
│   ├── 03.broken-counter
│   └── 05.broken-guestbook
│
└── C.design-challenge
    ├── 01.PinkyPromise
    ├── 02.OpenPetition
    └── 03.BucketList
```

### Filtering Tests

You can filter tests using the following syntax

```bash
yarn test -f <contract name>
# for example
# yarn test -f greeting
```

### Mock Deployment

You must specify the contract file and method when attempting to execute the contract in the local mock virtual machine

```bash
yarn mock --wasm-file <path to contract .wasm file> --method-name <contract method name>
# for example
# yarn mock --wasm-file ./out/counter.wasm --method-name incrementCounter
```

*Note the projects are ordered by increasing complexity so lower numbers roughly implies "easier to understand".*

## Activity::Scavenger Hunt

Keep your own notes.  Time permitting, we will share and discuss your findings and answer questions at the end of the activity.

Find examples of the following.  

**Orientation**

*Note, some of these may only take you **a few seconds** to complete so don't overthink things.  This activity is about massive exposure to several examples of smart contracts written using AssemblyScript for the NEAR platform.*

- [ ] a contract method that takes no parameters
- [ ] a contract method that takes one parameter
- [ ] a model used by a contract method
- [ ] a failing unit test
- [ ] a passing unit test
- [ ] unit testing log output from the NEAR Virtual Machine (VM)
- [ ] unit testing the instantiation of a model (ie. `new ModelName()`)
- [ ] unit testing a contract method
- [ ] unit testing a method on a model

**Storing Data**

NEAR Protocol stores data in a key-value store called `Storage` which is also wrapped with a few persistent collections for developer convenience including `PersistentVector`, `PersistentSet`, `PersistentMap` and `PersistentDeque`.  Reading and writing to `Storage` requires specifying the type of data to store, whether `string`, `number` or `binary`.  Any custom data types (ie. custom data models) must be decorated with the `@nearBindgen` decorator so that the system knows to serialize them for storage.

- [ ] an example that includes the `@nearBindgen` decorator (used to support serialization of custom data models)
- [ ] an example that uses `Storage` to read and / or write data from blockchain storage
- [ ] an example that uses `PersistentVector` to store contract data in an array-like data structure
- [ ] an example that uses `PersistentMap` to store contract data in a map-like data structure
- [ ] an example that uses `PersistentDeque` to store contract data in a queue-like data structure
- [ ] an example that uses `PersistentSet` to store contract data in a set-like data structure
- [ ] an example that uses the `getPrimitive<T>()` method on the `Storage` class
- [ ] an example that uses the `getString()` method on the `Storage` class
- [ ] an example that uses the `setString()` method on the `Storage` class

**Contract Context**

NEAR Protocol requires that each account only have 1 contract deployed to its storage.  The account maintains a copy of the contract code as well as any state storage consumed by the contract.  You can read more about [accounts on the NEAR platform here](https://docs.nearprotocol.com/docs/concepts/account).

- [ ] an example of using `context.sender` which represents the account that signed the current transaction  
- [ ] an example of a unit test where the test explicitly sets the `signer_account_id` to control `context.sender`
- [ ] an example of using `context.contractName` which represents the account on which the contract lives
- [ ] an example of a unit test where the test explicitly sets the `current_account_id` to control `context.contractName`
- [ ] an example of using `context.attachedDeposit` to capture the tokens attached to a contract function call
- [ ] an example of a unit test where the test explicitly sets the `attached_deposit` to control `context.attachedDeposit`

**Validation**

- [ ] an example of using `assert()` to guarantee that some value meets the necessary criteria

## Activity::Debugging Challenge

Debug as many of the following problems as you can.  They are ordered by increasing difficulty.

**Important Note:** 
None of the tests were altered, only the `main.ts` contract file and / or the `model.ts` model file were changed from the original to create the problems you see in these failing tests or failures to compile the code. 

### Broken Greeting

- [ ] run `yarn test -f broken-greeting` and solve the issues (there are 4 of them)

### Broken Counter

- [ ] run `yarn test -f broken-counter` and solve the issues (there are 5 of them) 

*Hints*

- one error is preventing the code from compiling so none of the other tests are running.  solve the compiler error first so you can see the failing tests


### Broken Guestbook

- [ ] run `yarn test -f broken-guestbook` and solve the issues (there are several of them and many are preventing the code from compiling).  

*Hints*

- `@nearBindgen` is a decorator added to custom models so they can be serialized and stored on chain
- persistent collections like `PersistentVector<T>` require a type parameter which will often be the model you are trying to store on chain
- you can get the account name of the user that calls a function using `context.sender`


If you get really stuck on this debugging challenge and just can't get on with your day, have a look at the original working versions in section `A.scavenger-hunt` for the fixes.

## Activity::Design Challenge

Choose one of the following projects and write the model(s) and contract(s) that satisfy the following requirements.  Include unit tests of course.  Test everything locally using `yarn mock`.

**Important Note:** 
The design guidelines below are almost certainly incomplete.  They are intended to inspire you to consider the design challenge on your own or with your pair or team.  Feel free to run with these ideas and do not be constrained by what you see here.

### PinkyPromise

*(inspired by a 2019 hackathon project)*

PinkyPromise is a system for recording promises on the blockchain for all to see, forever and ever.  A promise is a piece of text that is made `from` someone `to` someone (possibly themselves).  A promise may eventually be marked as `kept` or `broken` by the owner of the `to` account.
  
**Models**

- `PinkyPromise`
  - Collects a commitment (as string) between two accounts (as strings).  Consider whether to use `Storage` directly (our on-chain key-value store) or one of the persistent collections that wraps `Storage` to mimic a Vector, Map, Queue or Set.

**Contracts**

- `main`
  - `makePromise(to: string, statement: string)` 

### BucketList

*(inspired by Covid-19)*

BucketList is a system that records things we wish we all could do as soon as it's safe to go back outside.  

**Models**

- `Activity` represents something we want to do
  - `description` as `string`
  - `cost` as `u8` (let's keep it small since these are frugal times)
  - `friends` as `PersistentVector<string>` of account names of our friends, if we have any

**Contracts**

- `main`
  - `add(item: string, friends: string[], cost: u8): bool`
  - `list(): Activity[]`

### OpenPetition

*(inspired by an internal hackathon project)*

OpenPetition is a system for managing the creation and support of petitions (ie. Change.org for blockchain).
**Models**

- `Petition`
  - Collects signatures (`context.sender`) in a `PersistentVector<string>` for anyone that calls the main contract's `sign` method, passing in the petition identifier.
  - The Petition model should include Petition metadata like 
    - `title` as `string`
    - `body` as `string` and 
    - `funding` as `u128`
  - The Petition model should include methods like
    - `sign(): bool`
    - `signWithFunds(amount: u128 = 0): bool`

**Contracts**

- `main` 
  - `sign(petitionId: string): bool` allows the `context.sender` to sign the petition
  - `list(): Array<string>` returns a list of petition identifiers
  - `show(petitionId: string): Petition` returns the details of a petition
  - `contract.petitions` could be the collection of petitions stored as a `PersistentMap<string, Petition>` where the key is petition identifier and the value is the petition instance

**Stretch Goals**

- Consider how you would structure this project if each petition were its own contract instead of a model on a single contract.  What could the benefits of this be?


## Getting Help

If you find yourself stuck with any of this, feel free to reach out to us via the following links:

- [near.org / help](http://near.org/help)
- [NEAR Telegram Group](https://t.me/cryptonear)
- [NEAR Discord Channel](https://discordapp.com/invite/jsAu4pP)
- [Documentation](http://docs.nearprotocol.com/)