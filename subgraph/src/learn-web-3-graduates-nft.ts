import { BigInt } from "@graphprotocol/graph-ts";
import {
  LearnWeb3GraduatesNFT,
  TransferSingle as TransferSingleEvent,
} from "../generated/LearnWeb3GraduatesNFT/LearnWeb3GraduatesNFT";
import { SkillNft, User } from "../generated/schema";

export function handleTransferSingle(event: TransferSingleEvent): void {
  // Create a unique ID that refers to this listing
  // Concatenate the User address + the tokenId and the sender address
  const id =
    event.params.to.toHex() +
    "-" +
    event.params.id.toString() +
    "-" +
    event.params.from.toHex();

  // If the skillNft does not exist, create it
  let skillNft = SkillNft.load(id);
  if (!skillNft) {
    skillNft = new SkillNft(id);
    skillNft.organization = event.params.to.toHexString();
    skillNft.tokenId = event.params.id;
    skillNft.tokenValue = event.params.value.toString();
    skillNft.createdAtTimestamp = event.block.timestamp;
  

    // Get the instance of the LearnWeb3GraduatesNFT contract
    let learnWeb3GraduatesNFTContract = LearnWeb3GraduatesNFT.bind(
      event.address
    );
    skillNft.tokenURI = learnWeb3GraduatesNFTContract.uri(event.params.id);
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


