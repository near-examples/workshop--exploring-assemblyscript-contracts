const { Runtime, encodeBs64 } = require("near-sdk-as/runtime");
const path = require("path");

const sentencesWasm = path.join(__dirname, "/../out/sentences.wasm");
const wordsWasm = path.join(__dirname, "/../out/words.wasm");

let runtime, alice, sentences, words;

describe("cross contract calls", () => {
  beforeEach(() => {
    runtime = new Runtime();
    alice = runtime.newAccount("alice");
    sentences = runtime.newAccount("sentences", sentencesWasm);
    words = runtime.newAccount("words.examples", wordsWasm);
  });

  function addWord(hello) {
    return alice.call_other("sentences", "SetWord", {
      word: { text: "hello" },
    });
  }

  test("single promise", () => {
    let res = alice.call_other("sentences", "reverseWordOne");
    expect(res.return_data.text).toBe("elpmas");
  });

  test("promise + then with no arguments", () => {
    let res = alice.call_other("sentences", "reverseWordTwo");
    expect(res.return_data).toBe(true);
  });
  test("promise + then with arguments", () => {
    let res = alice.call_other("sentences", "reverseWordThree");
    expect(res.return_data).toBe(true);
  });

  test("add to storage", () => {
    addWord("hello");
    expect(sentences.storage_usage).toBeGreaterThan(0);
  });

  test("read from storage with default", () => {
    const word = sentences.view("GetWord").return_data;
    expect(word.text).toBe("DEFAULT");
    expect(sentences.state["word"]).toBe(undefined);
  });
  test("read from storage", () => {
    addWord("hello");
    const word = sentences.view("GetWord").return_data;
    expect(word.text).toBe("hello");
    expect(sentences.state["word"]).toStrictEqual(word);
  });

  test("setting state", () => {
    let state = { word: { lang: "en-us", text: "hello" } };
    sentences.state = state;
    sentences.reset();
    let { result } = addWord("hello");
    expect(result.state).toStrictEqual(state);
  });
});
