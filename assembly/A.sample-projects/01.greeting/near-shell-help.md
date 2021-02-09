To use NEAR Shell you'll first need to install it. Please refer to the [documentation](https://docs.near.org/docs/tools/near-cli).

Make sure you're in this folder then login to NEAR Shell and authorize it to use your account.

```
near login
```

A webpage will open to NEAR Wallet where you can create an account (if you don't already have one) and authorize NEAR Shell to use this account (by giving it a `FullAccess` key). If you're on a Windows computer you will need to copy and paste the link from your console into your browser.

The result of logging in will look something like this (it may also be colorized depending on your terminal).

```text
Please authorize NEAR Shell on at least one of your accounts.

If your browser doesn't automatically open, please visit this URL
https://wallet.testnet.near.org/login/?title=NEAR+Shell&public_key=ed25519%3A3KHz9owcKkcx9Q4P8VNCYyhXHaHJNjjxCadMx26CDTxB&success_url=http%3A%2F%2F127.0.0.1%3A5000
Please authorize at least one account at the URL above.

Which account did you authorize for use with NEAR Shell?
Enter it here (if not redirected automatically):
Logged in as [ <???>.testnet ] with public key [ ed25519:3KHz9o... ] successfully
```

If you check your filesystem you should see a new folder structured like this. Your private keys are in the JSON file so don't share that or commit it to a repo or **you risk losing control of your account** to anyone that finds it. This repository ignores all `neardev/` folders by default.

```text
neardev
└── default
    └── <???>.testnet.json
```

Whether you created a new account or used an existing one, you can always check the state of the account using NEAR SHell as well

```
near state <your account name>
```

This should report something like the following

```json
Account <???>.testnet
{
   "amount":"100000000000000000000000000",
   "locked":"0",
   "code_hash":"11111111111111111111111111111111",
   "storage_usage":182,
   "storage_paid_at":0,
   "block_height":2009726,
   "block_hash":"AmEJfazX6vb3LLKeQtPXUGyXto7V9SaGoU4AYRxY8MNe",
   "formattedAmount":"100"
}
```

**Notice**

- the value of `amount` is the number of NEAR tokens this account controls in a vanishingly small unit of measurement called yoctoNEAR (10^-24) (you will also notice that `formattedAmount` has brought the amount back down to a human friendly format).
- the value of `code_hash` will be all `1`s if this is an account with NO contract, otherwise this hash will be a fingerprint of the contract code (you can use this hash to check whether a contract is already deployed to an account, for example)
- the value of `storage_usage` will change depending on the size of a deployed contract (which consumes account state) and data in storage.

Having logged into NEAR Shell and verified your account state, we can now use this authorized account to create a _new account_ on the network just for the contract we want to test. We will also delete this account once we've finished testing with it.

---

> _A brief word about working with accounts_
>
> _To avoid counterproductive confusion, read this part carefully. You must make a few choices here before running this in your terminal._
>
> _Your current account is `<???>.testnet` -- this is the account you just authorized using NEAR Shell_
>
> _NEAR account names are scoped (like DNS for the web) so you can create any "sub-names" by prepending anything you like to your account name._
>
> _We're about to create an account for your contract named `greeting.<???>.testnet`._

```text
near create_account <CONTRACT ACCOUNT> --master-account <YOUR ACCOUNT> --helper-url https://helper.testnet.near.org
```

If your account was `bob.testnet` then the contract account would be `greeting.bob.testnet`.

```text
near create_account greeting.bob.testnet --master-account bob.testnet --helper-url https://helper.testnet.near.org
```

For this to work you must have already authorized NEAR Shell with `FullAccess` rights to the account listed after `--master-account` in the command above.

**If it works**, this should report something like the following

```text
Account greeting.<???>.testnet for network "default" was created.
```

**If it fails**, this will most likely report one of the following 3 errors:

(1) The `--master-account` **doesn't exist on the network**. To resolve, fix the account name.

```text
Server error: account <???> does not exist while viewing
```

(2) The `--master-account` **is not authorized for use by NEAR Shell**. To resolve, `near login` again.

```text
TypedError: Can not sign transactions for account <???>, no matching key pair found in Signer.
```

(3) The account named `<???>` already exists on the network. To resolve, either rename the account or recognize that you may have run this command twice, in which case, don't worry, be happy, you're ready to move on.

```text
AccountAlreadyExists [Error]: Can't create a new account <???>, because it already exists
```

---

At this point the contract should be deployed to the account `greeting.<???>.testnet`. Let's confirm

```
near state greeting.<???>.testnet
```

**If it works**, this should report something like the following

Account greeting.<???>.testnet

```json
{
  "amount": "100000000000000000000000000",
  "locked": "0",
  "code_hash": "11111111111111111111111111111111",
  "storage_usage": 182,
  "storage_paid_at": 0,
  "block_height": 2013415,
  "block_hash": "9cYMm5NtQ37RZDuHZKwCXKqKdsmLfMRuxtxoGGkfcXuZ",
  "formattedAmount": "100"
}
```

**If it fails** then take a minute to carefully create the contract account because it's required to move on.

Since the account is created we can compile and deploy the contract like this

```text
yarn build greeting
```

Which should report something like this

```text
compiling contract [ 01.greeting/main.ts         ] to [ out/greeting.wasm ]
```

And then

```text
near deploy --wasm-file ./out/greeting.wasm --account-id greeting.<???>.testnet

```

Which should report something like this

```text
Starting deployment. Account id: greeting.<???>.testnet, node: https://rpc.testnet.near.org, helper: https://helper.testnet.near.org, file: ./out/greeting.wasm
```

And we can check the contract account state again to see if we've deployed it correctly.

Account greeting.<???>.testnet

```json
{
  "amount": "99999999983957639545840000",
  "locked": "0",
  "code_hash": "EiYRuKQaJtc61Rm7rffGqY4B4rEhNaCyz1VxLYAUq8oE",
  "storage_usage": 6415,
  "storage_paid_at": 0,
  "block_height": 2014205,
  "block_hash": "hSjzKCUsiuU6niEdFFoAwbLswUs5d55vaaHX4DRR46H",
  "formattedAmount": "99.99999998395763954584"
}
```

**Notice**

- the `account` balance went from 100 NEAR tokens to 99 tokens and change (deploying the contract cost a small amount of tokens (1.6 ^ 16 yoctoNEAR) to purchase the gas for processing the `DeployContract` action included in the deployment transaction.
- unless the contract code changed since time of writing, the `code_hash` in your output should start with `EiYRuK...`, matching the one in the snippet above. Recall this is like a contract fingerprint which can be used to verify if a contract has been deployed to an account.
- `storage_used` has increased from 182 to 6246 since we're not only storing the name of the account now but also the contract deployed to it

And now that the contract is deployed we can test it out (remember to replace `<???>` so both account names below match your own)

```text
near call greeting.<???>.testnet sayMyName --account-id <???>.testnet --gas 10000000000000000000
```

Which should report something like

```text
Scheduling a call: greeting.<???>.testnet.sayMyName()
[greeting.<???>.testnet]: sayMyName() function was called
'Hello, <???>.testnet!'
```

If it fails it will most likely be one of the following errors

(1) The amount of NEAR attached to the call isn't enough to pay for the gas to process the transaction

```text
Exceeded the prepaid gas
```

(2) The network connection times out. To resolve, use a local node or switch to another network. It may happen that the transaction eis actually processed even though this error is reported. Compare current and previous account balance and note if any gas was consumed by this call (the difference between `amount` values will be on the order of hundreds of millions)

```text
Server error: Timeout
```

Testing the other method in this contract follows exactly the same process but we will also notice a change in the state of the contract as the signing account `<???>.testnet` is stored in contract state.

```text
near call greeting.<???>.testnet saveMyName --account-id <???>.testnet --gas 10000000000000000000
```

And finally let's delete the contract account to cleanup. This step is optional of course.

The format of this call is as follows where `<BENEFICIARY ACCOUNT>` is the account that will receive the balance of `amount` tokens in the deleted account.

```text
near delete greeting.<???>.testnet <BENEFICIARY ACCOUNT>
```

So this will clean up our work here

```text
near delete greeting.<???>.testnet <???>.testnet
```

Which should report something like

```text
Deleting account. Account id: greeting.<???>.testnet, node: https://rpc.testnet.near.org, helper: https://helper.testnet.near.org, beneficiary: <???>.testnet
Account greeting.<???>.testnet for network "default" was deleted.
```
