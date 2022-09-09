import { BigInt, json, log } from "@graphprotocol/graph-ts";
import {
  Transfer as TransferEvent,
  BuildSpace,
} from "../generated/BuildSpace/BuildSpace";
import { SkillsNft, User } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  // Create a unique ID for the skillNft by concatinating the sender's address,
  // the timestamp NFT was issued and the NFT tokenId
  const id =
    event.params.tokenId.toString() + "-" + event.block.timestamp.toHexString();

  // Check if skillNft already exists, if not create it
  let skillNft = SkillsNft.load(id);
  if (!skillNft) {
    skillNft = new SkillsNft(id);
    skillNft.tokenId = event.params.tokenId.toString();

    // Get the instance of the BuildSpace Contract
    // to initialize tokenURI, name
    let buildSpaceContract = BuildSpace.bind(event.address);
    skillNft.metadata = buildSpaceContract.tokenURI(event.params.tokenId);
    skillNft.name = buildSpaceContract.name();
    skillNft.createdAtTimeStamp = event.block.timestamp;
    skillNft.organization = event.params.from.toHex();
  }

  // Assign the skillNft to the owner
  let owner_id = event.params.to.toHex();
  /* If the user does not exist, that is, the transfer is just occurring for the
  first time, create the user */
  let user = User.load(owner_id);
  if (!user) {
    user = new User(owner_id);
  }

  skillNft.ownerId = owner_id;
  skillNft.owner = owner_id;

  // Save the skillNft and the user to the Node so we can query it later
  skillNft.save();
  user.save();
}
