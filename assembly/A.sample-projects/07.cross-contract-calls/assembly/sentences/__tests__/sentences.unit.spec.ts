import { reverseWordOne, reverseWordTwo, reverseWordThree } from "..";
// import { Context as VMContext, VM } from "near-sdk-as";

describe("07.  Cross-Contract Calls :: Sentences", () => {
  it("should reverse a sentence (one)", () => {
    reverseWordOne();
    // log(VM.outcome());
    // log(VM.logs());
  });

  it("should reverse a sentence (two)", () => {
    reverseWordTwo();
    // log(VM.outcome());
    // log(VM.logs());
  });

  it("should reverse a sentence (three)", () => {
    reverseWordThree();
    // log(VM.outcome());
    // log(VM.logs());
  });
});
