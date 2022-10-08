import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
} from "matchstick-as/assembly/index";
import { handleTransferSingle } from "../src/learn-web-3-graduates-nft";
// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("handleTransferSingle() should create a new entity", () => {
  afterAll(() => {
    clearStore();
  });

  describe("Create a new entity", () => {
    test("SkillNFT and User created and stored", () => {
      
      assert.entityCount("SkillsNft", 0);
      assert.entityCount("User", 0);

      // // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
      // assert.fieldEquals(6
      //   "User",
      //   "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      //   "account",
      //   "0x0000000000000000000000000000000000000001"
      // );
    });
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

 
});
