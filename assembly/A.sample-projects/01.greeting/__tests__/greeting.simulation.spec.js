const { Runtime } = require("near-sdk-as/runtime");
const path = require("path");

const WASM_FILE = __dirname + "/../out/greeting.wasm";

describe("Greeting ", () => {
  const users = ["alice", "bob", "carol"];
  const messages = ["awesomesauce!", "yashilsin!", "beleza!"];

  let runtime;
  let greeting;

  beforeAll(() => {
    runtime = new Runtime();
    greeting = runtime.newAccount("greeting", WASM_FILE);

    accounts = users
      .map((name) => runtime.newAccount(name))
      .reduce((acc, user) => {
        acc[user.account_id] = user;
        return acc;
      }, {});
  });

  afterEach(() => {
    greeting.state = {};
  });

  describe("View methods", () => {
    it("responds to showYouKnow()", () => {
      const transaction = {
        signer: accounts.alice,
        contract: greeting,
        method: {
          type: "view",
          name: "showYouKnow",
        },
      };

      const { result } = simulate(transaction);

      expectToFind("showYouKnow() was called", {
        inArray: result.outcome.logs,
      });
    });

    it("responds to sayHello()", () => {
      const transaction = {
        signer: accounts.alice,
        contract: greeting,
        method: {
          type: "view",
          name: "sayHello",
        },
      };

      const { result, data } = simulate(transaction);

      expect(data).toEqual("Hello!");
      expectToFind("sayHello() was called", {
        inArray: result.outcome.logs,
      });
    });

    describe("getAllMessages()", () => {
      it("works with 0 messages", () => {
        const transaction = {
          contract: greeting,
          method: {
            type: "call",
            name: "getAllMessages",
          },
        };

        const { result, data } = simulate(transaction);

        expectToFind("getAllMessages() was called", {
          inArray: result.outcome.logs,
        });
      });

      it("works with 1 message", () => {
        sendMessage(accounts.alice, { message: messages[0] });

        const transaction = {
          signer: accounts.alice,
          contract: greeting,
          method: {
            type: "call",
            name: "getAllMessages",
          },
        };

        const { result, data } = simulate(transaction);

        // TODO: this isn't the right account, should be alice
        expectToFind("alice says awesomesauce!", {
          inArray: data,
        });

        expectToFind("getAllMessages() was called", {
          inArray: result.outcome.logs,
        });
      });

      it("works with many messages", () => {
        let expectedMessages = [];

        Object.keys(accounts).map((user, idx) => {
          let signer = accounts[user];
          let message = messages[idx];

          sendMessage(signer, { message });
          expectedMessages.push(`${signer.account_id} says ${message}`);
        });

        const transaction = {
          contract: greeting,
          method: {
            type: "call",
            name: "getAllMessages",
          },
        };

        const { result, data } = simulate(transaction);

        expectedMessages.map((message) => {
          expectToFind(message, {
            inArray: data,
          });
        });

        expectToFind("getAllMessages() was called", {
          inArray: result.outcome.logs,
        });
      });
    });
  });

  describe("Call methods", () => {
    it("responds to sayMyName()", () => {
      const transaction = {
        signer: accounts.alice,
        contract: greeting,
        method: {
          type: "call",
          name: "sayMyName",
        },
      };

      const { data, result } = simulate(transaction);

      expect(data).toEqual(`Hello, ${accounts.alice.account_id}!`);
      expectToFind("sayMyName() was called", {
        inArray: result.outcome.logs,
      });
    });

    it("responds to saveMyName()", () => {
      const transaction = {
        signer: accounts.alice,
        contract: greeting,
        method: {
          type: "call",
          name: "saveMyName",
        },
      };

      const { result } = simulate(transaction);

      // "c2VuZGVy" is "sender" in base64
      // "YWxpY2U=" is "alice" in base64
      expect(result.state).toHaveProperty("c2VuZGVy", "YWxpY2U=");

      expectToFind("saveMyName() was called", {
        inArray: result.outcome.logs,
      });
    });

    it("responds to saveMyMessage()", () => {
      const transaction = {
        contract: greeting,
        method: {
          type: "call",
          name: "saveMyMessage",
          params: { message: "awesomesauce" },
        },
      };

      const { data, result } = simulate(transaction);

      expect(data).toBeTruthy();

      // "bWVzc2FnZXM6Oi0x" is "messages::-1" in base64
      // "Z3JlZXRpbmcgc2F5cyBhd2Vzb21lc2F1Y2U=" is "greeting says awesomesauce" in base64
      expect(result.state).toHaveProperty(
        "bWVzc2FnZXM6Oi0x",
        "Z3JlZXRpbmcgc2F5cyBhd2Vzb21lc2F1Y2U="
      );

      expectToFind("saveMyMessage() was called", {
        inArray: result.outcome.logs,
      });
    });

    it("responds to saveMyMessage()", () => {
      const transaction = {
        signer: accounts.alice,
        contract: greeting,
        method: {
          type: "call",
          name: "saveMyMessage",
          params: { message: "awesomesauce" },
        },
      };

      const { data, result } = simulate(transaction);

      expect(data).toBeTruthy();

      // "bWVzc2FnZXM6Oi0x" is "messages::-1" in base64
      // "YWxpY2Ugc2F5cyBhd2Vzb21lc2F1Y2U=" is "alice says awesomesauce" in base64
      expect(result.state).toHaveProperty(
        "bWVzc2FnZXM6Oi0x",
        "YWxpY2Ugc2F5cyBhd2Vzb21lc2F1Y2U="
      );

      expectToFind("saveMyMessage() was called", {
        inArray: result.outcome.logs,
      });
    });
  });

  describe("Cross-contract calls()", () => {
    test.todo("add cross contract call examples");

    // let sentences: Account, words: Account, alice: Account;
    // describe("cross contract calls", () => {
    //   beforeEach(() => {
    //     runtime = new Runtime();
    //     alice = runtime.newAccount("alice");
    //     sentences = runtime.newAccount("sentences", __dirname + "/../out/sentences.wasm");
    //     words = runtime.newAccount("words.examples", __dirname + "/../out/words.wasm");
    //   });

    //   test("single promise", () => {
    //     let res = alice.call_other("sentences", "reverseWordOne");
    //     expect(res.return_data.text).toBe("elpmas")
    //   });

    //   test("promise + then with no arguments", () => {
    //     let res  = alice.call_other("sentences", "reverseWordTwo");
    //     expect(res.return_data).toBe(true)
    //   });
    //   test("promise + then with arguments", () => {
    //     let res  = alice.call_other("sentences", "reverseWordThree");
    //     expect(res.return_data).toBe(true)
    //   });
    // })
  });

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------

  function sendMessage(signer, params) {
    const transaction = {
      signer,
      contract: greeting,
      method: {
        type: "view",
        name: "saveMyMessage",
        params,
      },
    };

    const { data } = simulate(transaction);

    expect(data).toBeTruthy();
  }

  function expectToFind(target, { inArray }) {
    if (inArray) {
      expect(inArray).toEqual(expect.arrayContaining([target]));
    }
  }

  function simulate({ signer, contract, method }, printResponse = false) {
    let response;

    if (signer) {
      response = signer.call_other(
        contract.account_id,
        method.name,
        method.params
      );
    } else {
      response = contract[method.type](method.name, method.params);
    }

    if (printResponse) {
      console.log("\n\n------ Near VM Response ------");
      console.log(JSON.stringify(response, null, 2));
    }

    return {
      data: response.return_data,
      error: response.err,
      result: response.result,
      results: response.results,
      calls: response.calls,
    };
  }

  function getContext() {
    return {
      input: "{}",
      output_data_receivers: [],
      prepaid_gas: 10 ** 15,
      attached_deposit: "0",
      is_view: false,
      block_index: 1,
      block_timestamp: 1585778575325000000,
      epoch_height: 1,
      storage_usage: 100,
      random_seed: "KuTCtARNzxZQ3YvXDeLjx83FDqxv2SdQTSbiq876zR7",
      current_account_id: "alice",
      signer_account_id: "alice",
      predecessor_account_id: "bob",
      account_balance: "1000",
      signer_account_pk: "KuTCtARNzxZQ3YvXDeLjx83FDqxv2SdQTSbiq876zR7",
      account_locked_balance: "10",
    };
  }
});
