import { BigInt, json, log } from "@graphprotocol/graph-ts";
import {
  Transfer as TransferEvent,
  BuildSpace,
} from "../generated/BuildSpace/BuildSpace";
import { SkillsNft, User } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let skillNftId = event.params.tokenId.toString();
  // Check if skillNft already exists, if not create it
  let skillNft = SkillsNft.load(skillNftId);
  if (!skillNft) {
    skillNft = new SkillsNft(skillNftId);
    skillNft.organization = event.params.from.toString();
    skillNft.tokenId = skillNftId;

    // Get the instance of the BuildSpace Contract
    // to initialize tokenURI, name
    let buildSpaceContract = BuildSpace.bind(event.address);
    skillNft.image = buildSpaceContract.tokenURI(event.params.tokenId);
    skillNft.name = buildSpaceContract.name();
    skillNft.createdAtTimeStamp = event.block.timestamp;
  }

  // Assign the skillNft to the owner
  let owner_id = event.params.to.toString();
  skillNft.ownerId = owner_id;
  skillNft.owner = owner_id;

  /* If the user does not exist, create it */
  let user = User.load(owner_id);
  if (!user) {
    user = new User(owner_id);
  }

  // Save the skillNft and the user to the Node so we can query it later
  skillNft.save();
  user.save();
}
