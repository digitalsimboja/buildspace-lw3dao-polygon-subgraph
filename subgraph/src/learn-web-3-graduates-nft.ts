import { BigInt } from "@graphprotocol/graph-ts";
import {
  LearnWeb3GraduatesNFT as NFTContract,
  TransferSingle as TransferSingleEvent,
  URI,
} from "../generated/LearnWeb3GraduatesNFT/LearnWeb3GraduatesNFT";
import { SkillsNft, User } from "../generated/schema";

export function handleTransferSingle(event: TransferSingleEvent): void {
  // Create a unique ID for the skillNft by concating the sender's address,
  // the timestamp NFT was issued and the NFT tokenId
  const id =
    event.params.operator.toHex() +
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

    // Get the instance of the  contract
    let nftContract = NFTContract.bind(event.address);
    //
    skillNft.metadata = nftContract.uri(event.params.id);
    skillNft.name = nftContract._name;
    skillNft.createdAtTimeStamp = event.block.timestamp;
    skillNft.organization = event.params.operator.toHex();
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
