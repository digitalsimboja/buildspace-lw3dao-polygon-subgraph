import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  LearnWeb3GraduatesNFT,
  TransferSingle,
  URI,
} from "../generated/LearnWeb3GraduatesNFT/LearnWeb3GraduatesNFT";
import { SkillsNft, User, UserSkillsNft } from "../generated/schema";

function getIdFromSkillNftIdInt(param1: Address, param2: BigInt): string {
  // Create the ID of the skillNft on the Node by concatinating the user address and
  // the skillNft Id
  return param1.toHexString() + "-" + param2.toHexString();
}

export function handleTransferSingle(event: TransferSingle): void {
 
  // If the userSkillNft does not exist, create it
  const userSkillNftId = getIdFromSkillNftIdInt(
    event.params.to,
    event.params.id
  );
  let userSkillNft = UserSkillsNft.load(userSkillNftId);
  if(!userSkillNft) {
    userSkillNft = new UserSkillsNft(userSkillNftId);

    userSkillNft.user = event.params.to.toHexString();
    userSkillNft.skillNft = event.params.id.toHexString();
    userSkillNft.save();
  }

  // First attempt to load the User from the Graph Node and check if exists
  // then Save the user object against this skillNft on the Graph Node
  const userAddress = event.params.to.toHexString();
  let user = User.load(userAddress);
  if (!user) {
    user = new User(userAddress);
    user.skillNfts =  new Array<string>()
  }
  // Update the user's skillNfts data
  let arrUserSkillNfts = user.skillNfts;
  arrUserSkillNfts.push(userSkillNft.id)
  user.skillNfts = arrUserSkillNfts;
  user.save();

  // If the skillNft does not exist, create it
  const skillNftId = event.params.id.toHexString();
  let skillNft = SkillsNft.load(skillNftId);
  if (!skillNft) {
    skillNft = new SkillsNft(skillNftId);
    skillNft.id = userSkillNft.id;
    skillNft.organization = event.params.operator;
    skillNft.tokenId = event.params.id;
    skillNft.tokenValue = event.params.value;
    skillNft.owners = new Array<string>()
    // Get the instance of the LearnWeb3GraduatesNFT Contract
    let LearnWeb3GraduatesNFTContract = LearnWeb3GraduatesNFT.bind(
      event.address
    );
    skillNft.tokenURI = LearnWeb3GraduatesNFTContract.uri(event.params.id);
  }
  // Update the SkillsNft data
  let arrSkillsNftOwners = skillNft.owners;
  arrSkillsNftOwners.push(event.params.to.toHexString());
  skillNft.owners = arrSkillsNftOwners;

  skillNft.createdAtTimestamp = event.block.timestamp; // To represent the date user received the graduation POK NFT
   
  // Save the new skillNft on the node so we can query it later
  skillNft.save();

}

export function handleURI(event: URI): void {
  // Try to load the skillNft from the Graph Node
  let skillNft = SkillsNft.load(event.params.id.toHexString());
  if (!skillNft) return;
  skillNft.tokenId = event.params.id;
  skillNft.save();
}
