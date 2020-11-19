import { VMContext, u128 } from "near-sdk-as";
import {
  init,
  totalSupply,
  balanceOf,
  transfer,
  approve,
  transferFrom,
} from "../assembly";

let alice = "alice";
let bob = "bob.near";
let eve = "eve.near";

describe("04. Token", () => {
  beforeEach(() => {
    VMContext.setSigner_account_id(alice);
    VMContext.setAccount_balance(u128.fromString("1000000"));
    init(alice);
  });

  it("initially has " + totalSupply() + " tokens", () => {
    expect(balanceOf(alice).toString()).toBe("1000000");
  });

  it("can transfer to other account", () => {
    const aliceStartBalance = balanceOf(alice);
    const bobStartBalance = balanceOf(bob);

    transfer(bob, 100);

    const aliceEndBalance = balanceOf(alice);
    const bobEndBalance = balanceOf(bob);
    expect(aliceEndBalance).toBe(aliceStartBalance - 100);
    expect(bobEndBalance).toBe(bobStartBalance + 100);
  });

  it("can transfer from approved account to another account", () => {
    transfer(bob, 100);
    const aliceStartBalance = balanceOf(alice);
    const bobStartBalance = balanceOf(bob);
    const eveStartBalance = balanceOf(eve);

    approve(eve, 100);

    const aliceMidBalance = balanceOf(alice);
    const bobMidBalance = balanceOf(bob);
    const eveMidBalance = balanceOf(eve);
    expect(aliceMidBalance).toBe(aliceStartBalance);
    expect(bobMidBalance).toBe(bobStartBalance);
    expect(eveMidBalance).toBe(eveStartBalance);

    // TODO: Use "eve" as sender
    transferFrom(alice, eve, 50);

    const aliceEndBalance = balanceOf(alice);
    const bobEndBalance = balanceOf(bob);
    const eveEndBalance = balanceOf(eve);
    expect(aliceEndBalance).toBe(aliceStartBalance - 50);
    expect(bobEndBalance).toBe(bobStartBalance);
    expect(eveEndBalance).toBe(eveStartBalance + 50);
  });
});
