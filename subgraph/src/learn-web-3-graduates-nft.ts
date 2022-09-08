import { BigInt } from "@graphprotocol/graph-ts"
import {
  LearnWeb3GraduatesNFT,
  TransferBatch,
  TransferSingle,
  URI
} from "../generated/LearnWeb3GraduatesNFT/LearnWeb3GraduatesNFT"
import {
  SkillsNft,
  User
} from "../generated/schema"


export function handleTransferBatch(event: TransferBatch): void {}

export function handleTransferSingle(event: TransferSingle): void {
  // Try and load the skillNft from the Graph Node and check if already exists
  let skillNft = SkillsNft.load(event.params.id.toString());
  if (!skillNft) {
    skillNft = new SkillsNft(event.params.id.toString());
    skillNft.issuer = event.params.operator.toHexString();
    skillNft.tokenId = event.params.id;
    skillNft.createdAtTimestamp = event.block.timestamp;

    // Get the instance of the LearnWeb3GraduatesNFT Contract
    let LearnWeb3GraduatesNFTContract = LearnWeb3GraduatesNFT.bind(event.address);
    skillNft.tokenURI = LearnWeb3GraduatesNFTContract.uri(event.params.id);
  }
  // set the new owner of the skillNft to the user
  skillNft.owner = event.params.to.toHexString();

  // Save the new skillNft on the node so we can query it later
  skillNft.save();

  // First attempt to load the User from the Graph Noe and check if exists
  // then Save the user object against this skillNft on the Graph Node
  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
  
}

export function handleURI(event: URI): void {
  // Try to load the skillNft from the Graph Node
  let skillNft = SkillsNft.load(event.params.id.toString());
  if (!skillNft) return
  skillNft.tokenId = event.params.id;
  skillNft.save();
}
