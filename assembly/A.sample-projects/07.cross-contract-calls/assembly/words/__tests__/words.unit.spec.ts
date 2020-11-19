import { reverse, upcase } from "..";
import { Word } from "../model";
import { VMContext, VM } from "near-sdk-as";

const alice: string = "alice";

let text: string;
let lang: string;
let word: Word;

describe("07.  Cross-Contract Calls :: Words", () => {
  beforeEach(() => {
    text = "sample";
    lang = "en-us";
    word = new Word(text, lang);

    VMContext.setSigner_account_id(alice);
  });

  it("should reverse a word", () => {
    const result = reverse(word);
    expect(result.text).toBe(text.split("").reverse().join(""));
  });

  it("should append to the log when reversing a word", () => {
    reverse(word);
    // log(VM.logs())
    expect(VM.logs()).toContainEqual(
      "[" + alice + "] invoked function reverse(" + text + ")"
    );
  });

  it("should upcase a word", () => {
    const result = upcase(word);
    expect(result.text).toBe(text.toUpperCase());
  });

  it("should append to the log when upcasing a word", () => {
    upcase(word);
    // log(VM.logs())
    expect(VM.logs()).toContainEqual(
      "[" + alice + "] invoked function upcase(" + text + ")"
    );
  });
});
