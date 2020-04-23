import { sayMyName, saveMyName } from '../main';
import { storage, Context as VMContext, VM } from "near-sdk-as";

const sender = "alice"

describe("Greeting ", () => {
    beforeEach(() => {
        VMContext.setSigner_account_id(sender)
    })

    it("should say my name", () => {
        const name = sayMyName();
        expect(name).toBe("Hello, " + sender + "!")
    });

    it("should save my name", () => {
        saveMyName()
        expect(storage.getString("sender")).toBe(sender)
        storage.delete(sender)
    })

    it("should append to the logs", () => {
        sayMyName()
        saveMyName()
        // log(VM.logs())
        expect(VM.logs()).toContainEqual("sayMyName() function was called")
        expect(VM.logs()).toContainEqual("saveMyName() function was called")
    })

});

