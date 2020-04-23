import { u128, VM, Context as VMContext } from "near-sdk-as";
import {
  name, symbol, decimals,
  initialize, customize,
  // totalSupply, initialize, customize, balanceOf
  // , transfer,
  // allowance, approve, transferFrom
} from "../main";
import { getNewestTransferEvent, getNewestApprovalEvent } from "../models"

// accounts
const zero = "0x0";                 // the "zero-account" as specified by ERC-20
const contract = "example-token";   // initialized with totalSupply()
const alice = "alice";              // valid account
const bob = "bob";                  // valid account
const carol = "carol";              // valid account
const derek = "derek";              // invalid account

// token metadata
const _name = "Solidus Wonder Token";
const _symbol = "SWT";
const _decimals: u8 = 2;
const _supply = 100_000_000;

// wallet sizes
const small = u128.from(111)
const medium = u128.from(222)
const large = u128.from(333)

describe("ERC-20 Token (optional)", () => {
  beforeEach(() => {
    VMContext.setCurrent_account_id(contract);
    VMContext.setSigner_account_id(contract);
    customize()
    initialize()
  })

  it("should have a name", () => {
    expect(name()).toBe(_name)
  })

  it("should have a symbol", () => {
    expect(symbol()).toBe(_symbol)
  })

  it("should have decimals", () => {
    expect(decimals()).toBe(_decimals)
  })
})

describe("ERC-20 Token (startup)", () => {
  it("should respond to totalSupply()", () => {
    // expect(totalSupply()).toBe(u128.from(_supply))
  })

  it("should initially assign entire token supply to a single account", () => {
    // after successful initialization
    VMContext.setCurrent_account_id(contract);
    VMContext.setSigner_account_id(contract);
    expect(initialize()).toBeTruthy();

    // the balance of the initial owner should match the total supply
    // expect(balanceOf(contract)).toBe(totalSupply())
  })

  it("should record an initial transfer event", () => {
    // and event lots should include a record of the TransferEvent
    // log(VM.logs())
    // log(getNewestTransferEvent())
    initialize()
    const event = getNewestTransferEvent();
    expect(event.spender).toBe(zero);
    expect(event.from).toBe(zero);
    expect(event.to).toBe(contract);
    // expect(event.value).toBe(totalSupply());
  })
})

// describe("ERC-20 Token (steady state) ", () => {
//   beforeEach(() => {
//     // prepare to send a transaction as if coming from the contract account
//     VMContext.setCurrent_account_id(contract);
//     VMContext.setSigner_account_id(contract);
//     initialize()

//     // spread the wealth around
//     transfer(alice, small)
//     transfer(bob, medium)
//     transfer(carol, large)
//     // derek gets no love here
//   })

//   afterEach(() => {
//     VM.restoreState()     // reset balances after each test
//     // log(VM.logs())
//   })

//   describe("Transfers", () => {
//     it("should allow transfers between accounts", () => {
//       // record starting balances
//       const aliceStart = balanceOf(alice);
//       const bobStart = balanceOf(bob);

//       // assume alice signs a transfer transaction
//       VMContext.setSigner_account_id(alice);

//       // alice transfers amount to bob
//       const amount = u128.from(10);
//       transfer(bob, amount);

//       // respective balances should reflect the change
//       expect(balanceOf(alice)).toBe(u128.sub(aliceStart, amount));
//       expect(balanceOf(bob)).toBe(u128.add(bobStart, amount));

//       // test that a transfer event was recorded
//       // log(getNewestTransferEvent())
//       const event = getNewestTransferEvent();
//       expect(event.spender).toBe(alice);
//       expect(event.from).toBe(alice);
//       expect(event.to).toBe(bob);
//       expect(event.value).toBe(amount);
//     })

//     throws("should not allow transfers if balance is too low", () => {
//       // assume alice signs a transfer transaction
//       VMContext.setSigner_account_id(alice);

//       // alice transfers amt to bob
//       let amount = u128.from(10);
//       transfer(bob, amount);

//       // assume bob signs a transfer transaction
//       VMContext.setSigner_account_id(bob);

//       // record starting balances
//       const bobStartBalance = balanceOf(bob);

//       // bob attempts to transfer amount to carol but fails
//       amount = u128.from(999);
//       transfer(carol, amount);     // expect this line to throw an exception
//     })

//     throws("should not allow transfers from unfunded accounts", () => {
//       // assume derek signs a transfer transaction
//       VMContext.setSigner_account_id(derek);

//       // derek attempts to transfer amount to alice even though he has no tokens
//       const amount = u128.from(1);
//       transfer(alice, amount)
//     })

//   })

//   describe("Transfer Delegation ", () => {
//     it("should gracefully default to zero allowance", () => {
//       expect(allowance(alice, bob)).toBe(u128.Zero);
//     })

//     it("should support approved allowances", () => {
//       const approvedAmount = u128.from(10)

//       // assume alice signs a transfer transaction
//       VMContext.setSigner_account_id(alice);

//       // alice approves bob to spend 10 tokens on her behalf
//       approve(bob, approvedAmount)

//       expect(allowance(alice, bob)).toBe(u128.from(10));

//       // test that a approve event was recorded
//       // log(getNewestApprovalEvent())
//       const event = getNewestApprovalEvent();
//       expect(event.owner).toBe(alice);
//       expect(event.spender).toBe(bob);
//       expect(event.oldValue).toBe(u128.Zero);
//       expect(event.value).toBe(approvedAmount);
//     })

//     it("should support updating allowances", () => {
//       const limit1 = u128.from(10)
//       const limit2 = u128.from(20)

//       // assume alice signs a transfer transaction
//       VMContext.setSigner_account_id(alice);

//       // alice approves bob to spend some limit of tokens on her behalf
//       approve(bob, limit1)
//       expect(allowance(alice, bob)).toBe(limit1);

//       // test that a approve event was recorded
//       // log(getNewestApprovalEvent())
//       const event1 = getNewestApprovalEvent();
//       expect(event1.owner).toBe(alice);
//       expect(event1.spender).toBe(bob);
//       expect(event1.oldValue).toBe(u128.Zero);
//       expect(event1.value).toBe(limit1);

//       // alice approves bob to spend a different limit of tokens on her behalf
//       approve(bob, limit2)
//       expect(allowance(alice, bob)).toBe(limit2);

//       // test that a approve event was recorded
//       // log(getNewestApprovalEvent())
//       const event2 = getNewestApprovalEvent();
//       expect(event2.owner).toBe(alice);
//       expect(event2.spender).toBe(bob);
//       expect(event2.oldValue).toBe(limit1);
//       expect(event2.value).toBe(limit2);
//     })

//     throws("should avoid approving allowances when owner has insufficient funds", () => {
//       const approvedAmount = u128.from(10)

//       // assume derek signs a transfer transaction
//       VMContext.setSigner_account_id(derek);

//       // derek approves bob to spend 10 tokens on his behalf
//       approve(bob, approvedAmount)

//       // test that a approve event was recorded
//       // log(getNewestApprovalEvent())
//       const event = getNewestApprovalEvent();
//       expect(event.owner).toBe(alice);
//       expect(event.spender).toBe(bob);
//       expect(event.oldValue).toBe(u128.from(0));
//       expect(event.value).toBe(approvedAmount);
//     })

//     it("should allow approved transfers", () => {
//       const approvedAmount = u128.from(10)
//       const transferredAmount = u128.from(9)

//       // assume alice signs a transfer transaction
//       VMContext.setSigner_account_id(alice);

//       // alice approves bob to spend 10 tokens on her behalf
//       approve(bob, approvedAmount)

//       // test that a approve event was recorded
//       // log(getNewestApprovalEvent())
//       const approvalEvent = getNewestApprovalEvent();
//       expect(approvalEvent.owner).toBe(alice);
//       expect(approvalEvent.spender).toBe(bob);
//       expect(approvalEvent.oldValue).toBe(u128.Zero);
//       expect(approvalEvent.value).toBe(approvedAmount);

//       // assume bob signs a transfer transaction
//       VMContext.setSigner_account_id(bob);

//       const aliceBefore = balanceOf(alice);
//       const carolBefore = balanceOf(carol);

//       transferFrom(alice, carol, transferredAmount);

//       expect(balanceOf(alice)).toBe(u128.sub(aliceBefore, transferredAmount))
//       expect(balanceOf(carol)).toBe(u128.add(carolBefore, transferredAmount))

//       // test that a transfer event was recorded
//       // log(getNewestTransferEvent())
//       const transferEvent = getNewestTransferEvent();
//       expect(transferEvent.spender).toBe(bob);
//       expect(transferEvent.from).toBe(alice);
//       expect(transferEvent.to).toBe(carol);
//       expect(transferEvent.value).toBe(transferredAmount);

//     })

//     describe("", () => {
//       beforeEach(() => {
//         // assume alice signs a transfer transaction
//         VMContext.setSigner_account_id(alice);

//         // alice approves bob to spend 10 tokens on her behalf
//         approve(bob, u128.from(10))

//         // assume bob signs a transfer transaction
//         VMContext.setSigner_account_id(bob);
//       })

//       throws("should disallow transfers that exceed allowance limit", () => {
//         transferFrom(alice, carol, u128.from(11));
//       })

//       throws("should disallow transfers that incrementally rise above allowance limit", () => {
//         transferFrom(alice, carol, u128.from(9));
//         transferFrom(alice, carol, u128.from(2));
//       })

//     })
//   })
// })