import {
  Transfer as TransferEvent,
  BuildSpace,
} from "../generated/BuildSpace/BuildSpace";
import { SkillNft, User } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  // Create a unique ID that refers to this listing
  // Concatenate the User address + the tokenId and the sender address
  const id =
    event.params.to.toHex() +
    "-" +
    event.params.tokenId.toString() +
    "-" +
    event.params.from.toHex();

  // Check if skillNft already exists, if not create it
  let skillNft = SkillNft.load(id);
  if (!skillNft) {
    skillNft = new SkillNft(id);
    skillNft.organization = event.params.to.toHexString();
    skillNft.tokenId = event.params.tokenId;
    skillNft.createdAtTimestamp = event.block.timestamp;

    // Get the instance of the BuildSpace Contract
    let buildSpaceContract = BuildSpace.bind(event.address);
    skillNft.tokenURI = buildSpaceContract.tokenURI(event.params.tokenId);
  }
  skillNft.owner = event.params.to.toHexString();

  // Save the skillNft to the Node so we can query it later
  skillNft.save();

  /* If the user does not exist, create it */
  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}
