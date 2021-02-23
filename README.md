![Near, Inc. logo](https://near.org/wp-content/themes/near-19/assets/img/logo.svg?t=1553011311)

# NEAR Protocol Workshop :: Exploring AssemblyScript Contracts

This workshop includes several activities:

- a [**scavenger hunt**](#activityscavenger-hunt) through several AssemblyScript projects to get you quickly oriented
- a [**debugging challenge**](#activitydebugging-challenge) to fix a few failing unit tests with broken contracts
- a [**development lifecycle challenge**](#activitydevelopment-lifecycle) to guide you through NEAR platform tools for testing
- a [**design challenge**](#activitydesign-challenge) to create new contracts and related models that satisfy a set of requirements

**Prerequisites**

If you're already comfortable with TypeScript then reading AssemblyScript should be a breeze. If you're coming from JavaScript, you'll have to get your head around `static types` and code compilation (since JavaScript has dynamic types and is an interpreted language) but reading through the samples here should not be too difficult. If you have no programming experience then this workshop will be challenging for you -- find someone to pair with so you can stay motivated and productive.

**Companion Presentation**

This hands-on workshop is paired with a presentation called [Hello AssemblyScript](https://docs.google.com/presentation/d/1Sz823KGP_dI2bNUoTlQtphI3Sz2Jej5bmYl-oYhp5HM) which helps set the context for this work and clarifies a few key mental models.

Before diving into this workshop, have a look at the slides linked above.

**Orientation**

If you're totally new to NEAR you can [start here](https://docs.near.org/docs/concepts/new-to-near) with a high level overview.

NEAR Protocol (aka "NEAR") is a public peer-to-peer key-value database. Public as in open to everyone for reading anything and writing what you are allowed to. Write permissions are defined by access keys so only the owner of the data can give permissions to modify data they own.

Manipulation of data is controlled by stored procedures (smart contracts) executing as [WebAssembly (Wasm)](https://webassembly.org) which means they can be implemented in any programming language that compiles to Wasm (ie. Rust, AssemblyScript, Kotlin, C, C++, Nim, Zig, etc).  Currently only the first two languages are supported for development on the NEAR platform.

_We will not be building dApps around any of these contracts since our focus is on learning AssemblyScript. Almost all of the contract code presented in this workshop is also running on [live examples](https://near.dev) where you will also find the frontend code that relies on these contracts._

## Environment Setup

### Using Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/near-examples/workshop--exploring-assemblyscript-contracts)

### Local Setup

1. clone this repo locally
2. run `yarn` to install dependencies

## Available commands

### Building contracts

- `yarn build` builds all contracts
- `yarn build <contract name>` builds a specific contract
- `yarn clean` deletes the `out` folder containing built contracts

### Testing contracts

- `yarn test` runs unit tests for all contracts

See `package.json` for more detail about these and other scripts.

You will find the following folder structure in this repository under the `assembly` folder.

```text
assembly
│
├── A.sample-projects
│   ├── 01.greeting
│   ├── 02.wallet-example
│   ├── 03.counter
│   ├── 04.token-contract
│   ├── 05.guestbook
│   ├── 06.chat
│   └── 07.cross-contract-calls
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

```text
yarn test -f <contract name>.unit
```

For example:

`yarn test -f greeting.unit` or `yarn test -f counter.unit`

_Note the projects are ordered by increasing complexity so lower numbers roughly implies "easier to understand"._

## Activity::Scavenger Hunt

> **_Instructions_**
>
> 1. Scan the items to scavenge (ie. to find) in the lists below
> 2. For the most interesting ones, look for them in the folder called `A.sample-projects`
>
> All of them appear in contract files (`main.ts` and `model.ts`) or their unit tests (`*.unit.spec.ts`)
>
> Keep your own notes. Time permitting, we will share and discuss your findings and answer questions at the end of the activity.

**First Steps**

_Note, some of these may only take you **a few seconds** to complete so don't overthink things. This activity is about massive exposure to several examples of smart contracts written using AssemblyScript for the NEAR platform._

Find examples of the following:

- [ ] a contract method that takes no parameters
- [ ] a contract method that takes one parameter
- [ ] a model passed to a contract method

**Models Organize and Serialize Data**

NEAR Protocol stores data in a key-value store called `Storage`. For developer convenience when building more complex dApps, `Storage` is also wrapped by a few other persistent collections including `PersistentVector`, `PersistentSet`, `PersistentMap` and `PersistentDeque`.

Reading and writing to `Storage` requires specifying the type of data to store, whether `string`, `number` or `binary`.

All custom data types (ie. custom data models) must be decorated with the `@nearBindgen` decorator so that the system knows to serialize when storing and deserialize when retrieving them.

Find examples of the following:

- [ ] use of `Storage` to read and / or write data from blockchain storage
- [ ] use of `PersistentVector` to store contract data in an array-like data structure
- [ ] use of `PersistentMap` to store contract data in a map-like data structure
- [ ] use of `PersistentDeque` to store contract data in a queue-like data structure
- [ ] use of `PersistentSet` to store contract data in a set-like data structure
- [ ] an example that includes the `@nearBindgen` decorator
- [ ] use of the `getPrimitive<T>()` method on the `Storage` class
- [ ] use of the `getString()` method on the `Storage` class
- [ ] use of the `setString()` method on the `Storage` class

**Contracts Expose an Interface**

NEAR Protocol accounts are initially created without an associated contract. Each account can have a maximum of 1 contract deployed to its storage (although a contract may be deployed to many accounts).

Each account maintains it's own copy of a contract code as well as any state storage consumed by the contract during normal operation. You can read more about [accounts on the NEAR platform here](https://docs.near.org/docs/concepts/account).

Find examples of the following:

- [ ] use of `context.sender` which represents the account that signed the current transaction
- [ ] an example of a unit test where the test explicitly sets the `signer_account_id` to control `context.sender`
- [ ] use of `context.contractName` which represents the account on which the contract lives
- [ ] an example of a unit test where the test explicitly sets the `current_account_id` to control `context.contractName`
- [ ] use of `context.attachedDeposit` to capture the tokens attached to a contract function call
- [ ] an example of a unit test where the test explicitly sets the `attached_deposit` to control `context.attachedDeposit`

**Validation**

- [ ] use of `assert()` in a contract method to guarantee that some value meets the necessary criteria

## Activity::Debugging Challenge

> **_Instructions_**
>
> Debug as many of the following problems as you can.
>
> - They are ordered by increasing difficulty.
> - All of the related files appear in the folder called `B.debugging-challenge`
> - **None of the tests were altered**. Only the `main.ts` contract file and / or the `model.ts` model file were changed from the original to create the problems you see in these failing tests or failures to compile the code.
> - You know you're finished when the tests pass
>
> Keep your own notes. Time permitting, we will share and discuss your findings and answer questions at the end of the activity.

### Broken Greeting

- [ ] run `yarn test -f broken-greeting` and fix the failing unit tests

<details>
  <summary><em>Reveal hints</em></summary>
  <ul>
    <li>Run this command in the terminal to reveal the needed fixes<br><code>git diff --no-index assembly/B.debugging-challenge/01.broken-greeting/main.ts assembly/A.sample-projects/01.greeting/assembly/index.ts</code></li>
  </ul>
</details>

**You know you're finished when** the unit tests are all passing and you see something like this:

```text
[Describe]: 01. Greeting

 [Success]: ✔ should respond to showYouKnow()
 [Success]: ✔ should respond to sayHello()
 [Success]: ✔ should respond to sayMyName()
 [Success]: ✔ should respond to saveMyName()
 [Success]: ✔ should respond to saveMyMessage()
 [Success]: ✔ should respond to getAllMessages()

    [File]: B.debugging-challenge/01.broken-greeting/__tests__/greeting.spec.ts
  [Groups]: 2 pass, 2 total
  [Result]: ✔ PASS
[Snapshot]: 0 total, 0 added, 0 removed, 0 different
 [Summary]: 6 pass,  0 fail, 6 total
    [Time]: 13.597ms
```

### Broken Counter

- [ ] run `yarn test -f broken-counter` and fix the failing unit tests

<details>
  <summary><em>Reveal hints</em></summary>
  <ul>
    <li>One error is preventing the code from compiling so none of the other tests are running.  solve the compiler error first so you can see the failing tests</li>
    <li>Run this command in the terminal to reveal the needed fixes<br><code>git diff --no-index assembly/B.debugging-challenge/03.broken-counter/main.ts assembly/A.sample-projects/03.counter/assembly/index.ts</code></li>
  </ul>
</details>

### Broken Guestbook

- [ ] run `yarn test -f broken-guestbook` and fix the failing unit tests

Note, in this challenge, some of the issues are preventing the code from the compiling in the first place, so the tests aren't even running.

<details>
  <summary><em>Reveal hints</em></summary>
  <li><code>@nearBindgen</code> is a decorator added to custom models so they can be serialized and stored on chain</li>
  <li>Persistent collections like <code>PersistentVector<T></code>require a type parameter which will often be the model you are trying to store on chain</li>
  <li>You can get the account name of the user that calls a function using <code>context.sender</code></li>
  <li>Run this command in the terminal to reveal the needed fixes for the <strong>contract</strong><br><code>git diff --no-index assembly/A.sample-projects/05.guestbook/main.ts assembly/B.debugging-challenge/05.broken-guestbook/main.ts</code></li>
  <li>Run this command in the terminal to reveal the needed fixes for the <strong>model</strong><br><code>git diff --no-index assembly/B.debugging-challenge/05.broken-guestbook/model.ts assembly/A.sample-projects/05.guestbook/assembly/model.ts</code></li>
</details>

## Activity::Development Lifecycle

> **_Instructions_**
>
> Open the challenge linked in this section
>
> - All related code is located in `A.sample-projects/01.greeting`
>
> Keep your own notes. Time permitting, we will share and discuss your findings and answer questions at the end of the activity.

Let's explore the contract development lifecycle on NEAR Protocol.

We will start with a simple but instructive contract design and explore the contract interface (hint: you've seen it already), build the contract (with a quick peek at the WebAssembly text format), and finally test the contract using unit tests, simulation tests and integration tests.

As we move from end-to-in in this process, focus on the parts that are most interesting to you and feel free to skip the parts that are boring or maybe overwhelming. Come back anytime.

[Open the **Development Lifecycle** challenge](assembly/A.sample-projects/01.greeting/README.md)

## Activity::Design Challenge

> **_Instructions_**
>
> 1. Choose one of the following projects and write the model(s) and contract(s) that satisfy the following requirements.
> 2. Write unit tests for all models and contracts.
>
> Keep your own notes. Time permitting, we will share and discuss your findings and answer questions at the end of the activity.

**Important Note:**
The design guidelines below are almost certaginly incomplete. They are intended to inspire you to consider the design challenge on your own or with your pair or team. Feel free to run with these ideas and do not be constrained by what you see here.

### PinkyPromise

_(inspired by a 2019 hackathon project)_

PinkyPromise is a system for recording promises on the blockchain for all to see, forever and ever. A promise is a piece of text that is made `from` someone `to` someone (possibly themselves). A promise may eventually be marked as `kept` or `broken` by the owner of the `to` account.

**Models**

- `PinkyPromise`
  - Collects a commitment (as string) between two accounts (as strings). Consider whether to use `Storage` directly (our on-chain key-value store) or one of the persistent collections that wraps `Storage` to mimic a Vector, Map, Queue or Set.

**Contracts**

- `main`
  - `makePromise(to: string, statement: string)`

### BucketList

_(inspired by Covid-19)_

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

_(inspired by an internal hackathon project)_

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

- Consider how you would structure this project if each petition were its own contract instead of a model on a single contract. What could the benefits of this be?

## Getting Help

If you find yourself stuck with any of this, feel free to reach out to us via the following links:

- [near.org / help](http://near.org/help)
- [near.chat](http://near.chat)
- [documentation](http://docs.near.org)
