const DEBUG = true;    // set to `true` to surface debug log msgs throughout

/**
 * EIP 20: ERC-20 Token Standard
 *
 * ERC-20 is a standard interface for tokens which allows for the implementation
 * of a standard API for tokens within smart contracts. This standard provides
 * basic functionality to transfer tokens, as well as allow tokens to be approved
 * so they can be spent by another on-chain third party.
 *
 * A standard interface allows any tokens to be re-used by other applications,
 * from wallets to decentralized exchanges.
 *
 * quoting  https://eips.ethereum.org/EIPS/eip-20
 * see more @ https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC20
 * see more @ https://github.com/ConsenSys/Tokens/blob/master/contracts/eip20/EIP20Interface.sol
 */
import {
  u128,                 // extended number type for working with large numbers
  logging,              // append log messages to VM logging, exposed via `logging.log()` to JS Dev console and via `logs()` in mock VM
  context,              // access to contract context for sender, attachedDeposit and others. see https://github.com/near/near-sdk-as/blob/master/assembly/runtime/contract.ts
  storage,              // key-value store representing contract state on the blockchain
  PersistentMap         // convenience wrapper around storage that mimics a strongly typed map
} from "near-sdk-as";

import {
  recordTransferEvent,  // record mock "event" when transfers are made by the contract
  recordApprovalEvent   // record mock "event" when approvals are made by the contract
} from "./models";      // NEAR doesn't currently provide an event model (as of 2020.03)

// ----------------------------------------------------------------------------
// OPTIONAL
// ----------------------------------------------------------------------------

/**
 * Returns the name of the token - ie. "Solidus Wonder Token"
 *
 * OPTIONAL - This method can be used to improve usability, but interfaces and
 *            other contracts MUST NOT expect these values to be present.
 *
 * @returns The name of the token
 */
export function name(): string {
  // if name has been customized, use it.  otherwise use default
  const name = storage.getSome<string>("_name");
  DEBUG ? logging.log("[status] Token.name: " + name) : false;
  return name;
}

/**
 * Returns the symbol of the token. ie. "SWT"
 *
 * OPTIONAL - This method can be used to improve usability, but interfaces and
 *            other contracts MUST NOT expect these values to be present.
 *
 * @returns The symbol of the token
 */
export function symbol(): string {
  // if symbol has been customized, use it.  otherwise use default
  const symbol = storage.getSome<string>("_symbol");
  DEBUG ? logging.log("[status] Token.symbol: " + symbol) : false;
  return symbol;
}

/**
 * Returns the number of decimals the token uses - ie. 8 - means to divide the
 * token amount by 100000000 (10^8) to get its user representation.
 *
 * OPTIONAL - This method can be used to improve usability, but interfaces and
 *            other contracts MUST NOT expect these values to be present.
 *
 * @returns The number of decimals the token uses
*/
export function decimals(): u8 {
  // if decimals has been customized, use it.  otherwise use default
  const decimals: u8 = storage.getSome<u8>("_decimals");
  DEBUG ? logging.log("[status] Token.decimals: " + decimals.toString()) : false;
  return decimals;
}

// // ----------------------------------------------------------------------------
// // REQUIRED
// // ----------------------------------------------------------------------------

// /**
//  * Returns the total token supply.
//  *
//  * @returns The total token supply
//  */
// export function totalSupply(): u128 {
//   // if totalSupply has been customized, use it.  otherwise use default
//   const totalSupply: u128 = storage.getSome<u128>("_totalSupply");
//   DEBUG ? logging.log("[status] Token.supply: " + totalSupply.toString()) : false;
//   return totalSupply;
// }

// /**
//  * Returns the account balance of another account with address `owner`.
//  *
//  * @param owner The address from which the balance will be retrieved
//  * @returns The balance for a given account
//  */
// export function balanceOf(owner: string): u128 {
//   DEBUG ? logging.log("[call] balanceOf(" + owner + ")") : false;

//   // let balance: u128 = balances.getSome(owner);
//   // let balance: u128 = <u128>balances.get(owner, u128.fromI32(0))!;
//   // let balance: u128 = <u128>balances.get(owner, u128.from(0))!;
//   // let balance: u128 = balances.get(owner, u128.Zero)!;
//   let balance: u128 = <u128>balances.get(owner, u128.Zero);
//   DEBUG ? logging.log("[status] " + owner + " has balance " + balance.toString()) : false;

//   return balance
// }

// /**
//  * Transfers `value` amount of tokens to address `to`, and MUST fire the Transfer
//  * event. The function SHOULD throw if the message caller's account balance
//  * does not have enough tokens to spend.
//  *
//  * Note Transfers of 0 values MUST be treated as normal transfers and fire the
//  * Transfer event.
//  *
//  * @param to The address of the recipient
//  * @param value The amount of token to be transferred
//  * @returns Whether the transfer was successful or not
//  */
// export function transfer(to: string, value: u128): boolean {
//   DEBUG ? logging.log("[call] transfer(" + to + ", " + value.toString() + ")") : false;

//   const sender = context.sender;
//   const recipient = to;

//   // sender account must exist and have tokens
//   assert(sender, "Sender can not be blank")
//   assert(balances.contains(sender), "Sender balance cannot be zero")

//   // fetch balances for sender and recipient
//   const senderBalance = <u128>balances.get(sender, u128.Zero);
//   const recipientBalance = <u128>balances.get(to, u128.Zero);

//   // sender tokens must be greater than or equal to value being transferred
//   assert(senderBalance >= value, "Sender has insufficient funds for transfer");

//   // move tokens among accounts
//   balances.set(sender, u128.sub(senderBalance, value));
//   balances.set(recipient, u128.add(recipientBalance, value));

//   // record the transfer event
//   let spender = sender;
//   recordTransferEvent(spender, spender, to, value);

//   return true;
// }

// /**
//  * Transfers `value` amount of tokens from address `from` to address `to`, and
//  * MUST fire the `Transfer` event.
//  *
//  * The transferFrom method is used for a withdraw workflow, allowing contracts
//  * to transfer tokens on your behalf. This can be used for example to allow a
//  * contract to transfer tokens on your behalf and/or to charge fees in
//  * sub-currencies. The function SHOULD throw unless the _from account has
//  * deliberately authorized the sender of the message via some mechanism.
//  *
//  * Note Transfers of 0 values MUST be treated as normal transfers and fire the
//  * Transfer event.
//  *
//  * @param from The address of the sender
//  * @param to The address of the recipient
//  * @param value The amount of token to be transferred
//  * @returns Whether the transfer was successful or not
//  */
// export function transferFrom(from: string, to: string, value: u128): boolean {
//   DEBUG ? logging.log("[call] transferFrom(" + from + ", " + to + ", " + value.toString() + ")") : false;

//   const owner = from;
//   const spender = context.sender;

//   // spender account must exist and be authorized to transfer funds
//   assert(spender, "Spender can not be blank")

//   // spender must be allowed to transfer this amount
//   assert(allowance(owner, spender) >= value, "Spender is not authorized to transfer amount")

//   // fetch balances for sender and recipient
//   const fromBalance = <u128>balances.get(from, u128.Zero);
//   const recipientBalance = <u128>balances.get(to, u128.Zero);

//   // sender tokens must be greater than or equal to value being transferred
//   assert(fromBalance >= value, "From account has insufficient funds for transfer");

//   // move tokens among accounts
//   balances.set(from, u128.sub(fromBalance, value));
//   balances.set(to, u128.add(recipientBalance, value));

//   // decrement allowance by transferred amount as well
//   decrementAllowance(owner, spender, value)

//   // record the transfer event
//   recordTransferEvent(spender, from, to, value);

//   return true;
// }

// /**
//  * Allows `spender` to withdraw from your account multiple times, up to the
//  * `value` amount. If this function is called again it overwrites the current
//  * allowance with `value`.
//  *
//  * NOTE: To prevent attack vectors like the ones described in the original spec,
//  * clients SHOULD make sure to create user interfaces in such a way that
//  * they set the allowance first to 0 before setting it to another value for the
//  * same spender. THOUGH The contract itself shouldn’t enforce it, to allow
//  * backwards compatibility with contracts deployed before
//  *
//  * @param address The address of the account able to transfer the tokens
//  * @param value The amount of tokens to be approved for transfer
//  * @returns Whether the approval was successful or not
//  */
// export function approve(spender: string, value: u128): boolean {
//   DEBUG ? logging.log("[call] approve(" + spender + ", " + value.toString() + ")") : false;

//   // get owner balance
//   const owner = context.sender;
//   const balance = <u128>balances.get(owner, u128.Zero);

//   // owner must have enough balance to approve this value
//   assert(balance >= value, "Owner has insufficient funds for approval")

//   // construct key in collection of allowances and fetch old allowance
//   const allowancesKey = getAllowancesKey(owner, spender);
//   const oldValue = <u128>allowances.get(allowancesKey, u128.Zero);

//   // save or update allowance
//   allowances.set(allowancesKey, value)

//   // record the approval event
//   recordApprovalEvent(owner, spender, oldValue, value);

//   return true;
// }

// /**
//  * Returns the amount which `spender` is still allowed to withdraw from `owner`.
//  *
//  * @param owner The address of the account owning tokens
//  * @param spender The address of the account able to transfer the tokens
//  * @returns Amount of remaining tokens allowed to spent
// */
// export function allowance(owner: string, spender: string): u128 {
//   DEBUG ? logging.log("[call] allowance(" + owner + ", " + spender + ")") : false;

//   // construct key in collection of allowances and return allowance
//   const allowancesKey = getAllowancesKey(owner, spender);
//   return <u128>allowances.get(allowancesKey, u128.Zero)
// }

// /**
//  * Helper function to decrement allowance
//  *
//  * @param owner The address of the account owning tokens
//  * @param spender The address of the account able to transfer the tokens
//  * @param value Amount
//  */
// function decrementAllowance(owner: string, spender: string, spent: u128): void {
//   const allowancesKey = getAllowancesKey(owner, spender);
//   const allowance = allowances.getSome(allowancesKey);
//   const remaining = u128.sub(allowance, spent);
//   allowances.set(allowancesKey, remaining);
// }

// /**
//  * Helper function to standardize the mapping
//  *
//  * This function would not be needed if we could embed a PersistentMap as
//  * the value of another PersistentMap
//  *
//  * @param owner of the account from which tokens will be spent
//  * @param spender of the tokens in the owners account
//  */
// function getAllowancesKey(owner: string, spender: string): string {
//   const separator: string = ":"
//   return owner + separator + spender
// }


// ----------------------------------------------------------------------------
// BOOK KEEPING
// ----------------------------------------------------------------------------

/**
 * balances of all accounts in the system.  this is the single source of truth for balances
 */
const balances = new PersistentMap<string, u128>("bal");  //  map[owner] = balance

/**
 * allowances of all accounts in the system.  this is the source of truth for allowed spending
 */
// const allowances = new PersistentMap<string, PersistentMap<string, u128>>("a"); // map[owner][spender] = allowance
const allowances = new PersistentMap<string, u128>("alw"); // map[owner:spender] = allowance

// ----------------------------------------------------------------------------
// EXTENDED FUNCTIONALITY
// ----------------------------------------------------------------------------

/**
 * This function supports the customization of this ERC-20 token before initialization
 * It may or may not be called.  If not called, the contract uses sensible defaults
 * If called, it can only be called once (!) and prevents repeat calls
 *
 * NOTE: this function uses storage keys with _underscore prefix since these are guaranteed not
 * to conflict with accounts on the NEAR platform. see https://nomicon.io/DataStructures/Account.html#examples
 *
 * THIS IS NOT part of the ERC-20 spec
 *
 * @param name The name of the token
 * @param symbol The symbol for the token
 * @param decimals The number of decimal places used when rendering the token
 * @param supply The total supply of the tokens
 * @param exchangeRate The exchange rate of tokens
 */

function _customize(
  name: string = "Solidus Wonder Token",        // awesome name for a token
  symbol: string = "SWT",                       // pronounced "sweet", rhymes with "treat"
  decimals: u8 = 2,                             // number of decimal places to assume for rendering,
  supply: u128 = u128.from(100_000_000),        // <raised pinky> one meeeeellion coins ... divisible in 100ths,
  exchangeRate: u8 = 100                        // of these ERC-20 tokens per NEAR token
): void {

  DEBUG ? logging.log("[call] customize('" + name + "', '" + symbol + "', " + decimals.toString() + ", " + supply.toString() + ", " + exchangeRate.toString() + ")") : false;

  const owner = assertTrueOwner()

  // only set values that are provided, otherwise ignore
  storage.setString("_bank", owner);
  storage.setString("_name", name);
  storage.setString("_symbol", symbol);
  storage.set<u8>("_decimals", decimals);
  storage.set<u128>("_totalSupply", supply);
  storage.set<u8>("_exchangeRate", exchangeRate);

}

/**
 * functions with default values can not be exported at this time
 */
export function customize(): void {
  _customize()
}

/**
 * This function initializes the token and assigns the configured total supply to a single account
 * This function may only be called once and prevents subsequent calls
 *
 * THIS IS NOT part of the ERC-20 spec
 */
export function initialize(): void {
  DEBUG ? logging.log("[call] initialize()") : false;

  // make sure the caller is the account that owns the contract
  const owner = assertTrueOwner()
  storage.set("_bank", owner)

  // transfer initial supply to initial owner
  const initialSupply: u128 = storage.getSome<u128>("_totalSupply");
  balances.set(owner, initialSupply);

  DEBUG ? logging.log("[status] Initial owner: " + owner) : false;

  // record the transfer event
  recordTransferEvent("0x0", "0x0", owner, initialSupply);
}

/**
 * A guard clause to prevent any account but the token contract itself from
 * invoking some methods
 *
 * THIS IS NOT part of the ERC-20 spec
 *
 * @returns The string representation of the contract `owner`
 */
function assertTrueOwner(): string {
  // only allow the contract account to invoke this guard clause
  const owner = context.sender

  // the contract name must be available
  assert(context.contractName, "Permission denied: ERR001")
  // the sender of this transaction must be the same account
  assert(owner == context.contractName, "Permission denied: ERR002")

  return owner
}