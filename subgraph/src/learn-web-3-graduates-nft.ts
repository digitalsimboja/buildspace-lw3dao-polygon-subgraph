import { BigInt } from "@graphprotocol/graph-ts";
import {
  LearnWeb3GraduatesNFT,
  TransferSingle as TransferSingleEvent,
  URI
} from "../generated/LearnWeb3GraduatesNFT/LearnWeb3GraduatesNFT";
import { SkillsNft, User } from "../generated/schema";

export function handleTransferSingle(event: TransferSingleEvent): void {
  const id = event.params.operator.toHex() +
    "-" +
    event.block.timestamp.toHexString() + 
    "-" +
    event.params.id.toHexString();
  
  // Check if skillNft already exists, if not create it
  let skillNft = SkillsNft.load(id);
  if (!skillNft) {
    skillNft = new SkillsNft(id);
    skillNft.tokenId = event.params.id.toString();
    skillNft.tokenValue = event.params.value.toString();

    // Get the instance of the LearnWeb3GraduatesNFT contract
    let learnWeb3GraduatesNFTContract = LearnWeb3GraduatesNFT.bind(
      event.address
    );
    skillNft.image = learnWeb3GraduatesNFTContract.uri(event.params.id);
    skillNft.name = learnWeb3GraduatesNFTContract._name;
    skillNft.createdAtTimeStamp = event.block.timestamp;
    skillNft.organization = event.params.operator.toHex();
  }

  // Assign the skillNft to the owner
  let owner_id = event.params.to.toHex();
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


export function handleURI(event: URI): void {
  
  // Try to load the skillNft from the Graph Node
  let skillNft = SkillsNft.load(event.params.id.toString());
  if (!skillNft) return
  skillNft.tokenId = event.params.id.toString();
  skillNft.save();
}