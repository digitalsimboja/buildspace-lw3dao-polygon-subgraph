import {
  Box,
  VStack,
  Button,
  Image,
  Flex,
  Divider,
  Heading,
  SimpleGrid,
  chakra,
  Grid,
  Text,
  GridItem,
  Container,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import {} from "@chakra-ui/react";
import { TokenKind } from "graphql";
import { useEffect, useState } from "react";
import { erc721ABI, useAccount, useContract, useProvider } from "wagmi";

const Feature = ({ organization, tokenId, tokenURI }) => {
  return (
    <GridItem>
      <chakra.h3 fontSize="sm" fontWeight="600">
        {organization}
      </chakra.h3>
      <chakra.p>{tokenId}</chakra.p>
    </GridItem>
  );
};

export default function Listing(props) {
  // state variables for setting the image, and name of ProofOfKnowledge NFT
  const [imageURI, setImageURI] = useState("");
  const [name, setName] = useState("");

  // state variable to hold the skill props
  const [proofOfKnowledge, setProofOfKnowledge] = useState(props.skills);
  console.log(proofOfKnowledge);

  // loading state
  const [loading, setLoading] = useState(true);

  // Get the provider, connected address and a contract instance
  // for the NFT contract using wagmi
  const provider = useProvider();
  const { address } = useAccount();
  // The contract instance for both Buildspace and Learnweb3
  /*
     const LearnWeb3Contract = useContract({
       addressOrName: props.nftLearnWeb3Address,
       contractInterface: erc721ABI,
       signerOrProvider: provider,
     });

     /*
     const BuildSpaceContract = useContract({
       addressOrName: props.nftBuildSpaceAddress,
       contractInterface: erc721ABI,
       signerOrProvider: provider,
     });
     */

  // Function to retrive NFT details from the contract
  async function fetchNFTDetails() {
    try {
      // Get tokenURI from the contract
      // First check type of contract
      if (props.nftLearnWeb3Address) {
        let tokenURI = await LearnWeb3Contract.uri(0);
        // If it's an IPFA URI, replace it with an HTTP Gateway link
        tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      if (props.nftBuildSpaceAddress) {
        let tokenURI = await BuildSpaceContract.tokenURI(0);
        // If it's an IPFA URI, replace it with an HTTP Gateway link
        tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      const metadata = await fetch(tokenURI);
      const metadataJSON = await metadata.json();

      // Extract the image URI from the metadata
      // TODO: Confirm if the metadata in leanweb3 is denoted as image or imageURl
      let image = metadataJSON.image;

      // If it's an IPFS URI, replace it with an HTTP Gateway link
      image = image.replace("ipfs://", "https://ipfs.io/ipfs/");

      // Update the state variables
      setName(metadataJSON.name);
      setImageURI(image);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    //fetchNFTDetails();
  }, []);

  return (
    <Box as={Container} maxW="7xl" mt={14} p={4}>
      <Box>
        <Text>Proof of Experience</Text>
      </Box>
      
      <Flex gap={"1rem"}>
      <SimpleGrid columns={[6, null, ]} spacing='20px'>
        {proofOfKnowledge.map((skill, i) => (
         
          <Flex
            key={i}
            flexDir={"column"}
            bgColor="gray"
            p={"2rem"}
            gap="1rem"
            color={"#fff"}
            justify="space-between"
          >
            <Image src={skill.tokenURI} />
            <Text as={"span"}>{skill.organization}</Text>
            <Text as={"p"}>{skill.tokenId}</Text>
          </Flex>
          
        ))}
        </SimpleGrid>
      </Flex>
      
    </Box>
  );
}
