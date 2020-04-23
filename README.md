![Near, Inc. logo](https://nearprotocol.com/wp-content/themes/near-19/assets/img/logo.svg?t=1553011311)

# Template for NEAR Protocol workshop activities

## Environment Setup

##### IMPORTANT: Make sure you have the latest version of NEAR Shell and Node Version >= 12.x 

1. [Node.js](https://nodejs.org/en/download/package-manager/)
2. (optional) `near-shell`

```
npm i -g near-shell
```

3. (optional) yarn

```
npm i -g yarn
```

4. Clone this repo locally

5. Run `yarn` in the repo folder to install dependencies

## Working with contracts

### To run unit tests

```bash
yarn test
```

### To build the contract

```bash
yarn build
```

### To deploy the contract

#### Locally using `mock-vm`

*This command will deploy and test a specific method.  See `package.json` for details.*

```bash
yarn mock
```

*On a machine with `awk` (macOS, Linux) you can also [install `jq`](https://stedolan.github.io/jq/download/) for nicer output*

```bash
# Format JSON response
yarn mock | awk 'FNR == 5 { print }' | jq '.'

# Extract return value from contract call
yarn mock | awk 'FNR == 5 { print }' | jq '.outcome.return_data'

# Extract logs from response
yarn mock | awk 'FNR == 5 { print }' | jq '.outcome.logs'
```

#### Network deployment using `NEAR Shell`

1. Login with NEAR Shell

- *You will need to install NEAR Shell first if you haven't already done so*
- *This step will create a local `neardev` folder with the private keys of your liked NEAR account*

```bash
near login
```

2. Deploy the contract to the account with which you just logged in above

```bash
near deploy --accountId <contract account>

# for example: 
# near deploy --accountId alice
```

3. Verify that the contract has been deployed to the intended account by matching the value of `code_hash` with the one in the JSON snippet below (`31ronb...`)

```bash
near state <contract account>  
```

```json
{
   "amount":"118836499627857616221445000",
   "locked":"0",
   "code_hash":"31ronb4A7DvktTa8sQCmPwT7FBg6qYMH3dM1fCPuSpQW",
   "storage_usage":13312,
   "storage_paid_at":0,
   "block_height":924926,
   "block_hash":"9yemJLcqLPCTiRNQmZK36M2BbDPPkTDPYKNeEGtt83JK",
   "formattedAmount":"118.836499627857616221445"
}
```

### To invoke methods on a deployed contract

- *Signer account may be the same as contract account for testing but will almost certainly **not be the same** in production*
- *See `assembly/main.ts` for available contract methods*

```bash
near call <contract account> <contract method> --accountId <signer account>

# for example: 
# near call alice sayMyName --accountId alice
```

## Walkthrough

### Ecosystem

This project is intended to operate within the NEAR ecosystem.  A few basic assumptions are:

- Accounts on NEAR are human readable names. 
  - Accounts maintain their own storage for which they pay rent in $NEAR tokens
  - Each account may have 1 contract deployed to its storage.  
    - Subsequent deployments overwrite contract code without affecting storage (this can cause confusion if the shape or nature of your data changes but names (ie. collection prefix) remain the same)
    - An account without a contract will report 
  - You can read [more about accounts here](https://docs.nearprotocol.com/docs/concepts/account)

- Contracts must be deployed to one (or more) specific account(s)
  - For a family of contracts, account names can be scoped as `contract1.myapp`, `contract2.myapp`

- To call methods on deployed contracts we have a choice of tools and interfaces
  - RPC ([see here](https://docs.nearprotocol.com/docs/interaction/rpc))
  - `near-api-js` ([see here](https://near.github.io/near-api-js/classes/_account_.account.html#functioncall))
  - `NEAR Shell` ([see here](https://docs.nearprotocol.com/docs/development/near-clitool))

- To run contracts in a local mock vm you can use `yarn mock`

### Filesystem

```bash
   ├── README.md               # this file
   ├── as-pect.config.js       # configuration for as-pect
   ├── asconfig.js             # AssemblyScript contract build script
   ├── assembly                # AssemblyScript contract 
   │   ├── __tests__
   │   │   ├── as-pect.d.ts    # header file for as-pect type detection
*  │   │   └── main.spec.ts    # AssemblyScript contract unit tests
   │   ├── as_types.d.ts       # header file for AssemblyScript type detection
*  │   ├── main.ts             # AssemblyScript contract
   │   └── tsconfig.json       # TypeScript config
   ├── package.json            # Node.js package manager
   └── yarn.lock               # Yarn lock file
```

The two critical files in this project are marked with an asterisk (`*`) in the tree view above.  They are:
- `assembly/__tests__/main.spec.ts` (contract unit tests)
- `assembly/main.ts` (the contract)

The rest of the files support the development, testing and deployment of the contract

### `yarn`

[![asciicast](https://asciinema.org/a/hYujvtaaO3ol9FTkzt9lOnH2j.svg)](https://asciinema.org/a/hYujvtaaO3ol9FTkzt9lOnH2j)

### `yarn test`

[![asciicast](https://asciinema.org/a/gLwYhhzPYQyW2wICQtbbz06Ph.svg)](https://asciinema.org/a/gLwYhhzPYQyW2wICQtbbz06Ph)

### `yarn build`

The build process is configured in the file `asconfig.js`.  Here you will find a few compiler optimizations as per the [AssemblyScript compiler docs](https://docs.assemblyscript.org/details/compiler).

#### Size & Speed Optimized (default)

```
 12K	out/main.wasm     (40% reduction in contract size for this contract)
 48K	out/main.wat
```

[![asciicast](https://asciinema.org/a/qPz0GYYwHRkzYkQ4kj8xpUmJM.svg)](https://asciinema.org/a/qPz0GYYwHRkzYkQ4kj8xpUmJM)

#### Non Optimized

```
 20K	out/main.wasm
104K	out/main.wat
```

*This can be useful for a more readable `WAT` file*

[![asciicast](https://asciinema.org/a/I9UJri2aVKLaBfV4ZPv6EIVnk.svg)](https://asciinema.org/a/I9UJri2aVKLaBfV4ZPv6EIVnk)


### `yarn mock`

[![asciicast](https://asciinema.org/a/uZdUCabC81di5zpVFTNvEaVns.svg)](https://asciinema.org/a/uZdUCabC81di5zpVFTNvEaVns)
