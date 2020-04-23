import { u128, VM } from "near-sdk-as";
import {
  TransferEvent, recordTransferEvent, getNewestTransferEvent,
  ApprovalEvent, recordApprovalEvent, getNewestApprovalEvent
} from "../models"

function logs(): string[] {
  return VM.outcome().logs;
}

const spender = "spender";
const owner = "owner";
const from = "from";
const to = "to";
const oldValue = u128.from(0);
const value = u128.from(0);

const transferEvent = new TransferEvent(spender, from, to, value);
const approvalEvent = new ApprovalEvent(owner, spender, oldValue, value);

describe("TransferEvent", () => {
  it("should allow instantiation", () => {
    expect(transferEvent instanceof TransferEvent).toBeTruthy()
  })

  it("should surface all parameters as attributes", () => {
    expect(transferEvent.spender).toBe(spender)
    expect(transferEvent.from).toBe(from)
    expect(transferEvent.to).toBe(to)
    expect(transferEvent.value).toBe(value)
  })

  it("should be recordable and retrievable", () => {
    recordTransferEvent(spender, from, to, value)
    const event = getNewestTransferEvent()

    expect(event instanceof TransferEvent).toBeTruthy()

    expect(event.spender).toBe(spender)
    expect(event.from).toBe(from)
    expect(event.to).toBe(to)
    expect(event.value).toBe(value)
  })
})

describe("ApprovalEvent", () => {
  it("should allow instantiation", () => {
    expect(approvalEvent instanceof ApprovalEvent).toBeTruthy()
  })

  it("should surface all parameters as attributes", () => {
    const approvalEvent = new ApprovalEvent(owner, spender, oldValue, value);
    expect(approvalEvent.owner).toBe(owner)
    expect(approvalEvent.spender).toBe(spender)
    expect(approvalEvent.oldValue).toBe(oldValue)
    expect(approvalEvent.value).toBe(value)
  })

  it("should be recordable and retrievable", () => {
    recordApprovalEvent(owner, spender, oldValue, value)
    const event = getNewestApprovalEvent()

    expect(event instanceof ApprovalEvent).toBeTruthy()

    expect(event.owner).toBe(owner)
    expect(event.spender).toBe(spender)
    expect(event.oldValue).toBe(oldValue)
    expect(event.value).toBe(value)
  })
})


