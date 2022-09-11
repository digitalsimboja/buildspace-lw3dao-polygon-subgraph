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
import { erc721ABI, useAccount, useContract, useProvider, useSigner } from "wagmi";

export default function Listing(props) {
  // state variable to hold the various NFTs from LearnWeb3 and BuildSpace
  const [learnWeb3NFTs, setLearnWeb3NFTs] = useState(props.learnWeb3);
  const [buildSpaceNFTs, setBuildspaceNFTs] = useState(props.buildSpace);

  // loading state
  const [loading, setLoading] = useState(true);

  // Get the signer, connected address and a contract instance
  // for the NFT contract using wagmi
  const provider = useProvider();
  const { address } = useAccount();
  const { isConnected } = useAccount();
  // The contract instance for both Buildspace and Learnweb3

  const LearnWeb3Contract = useContract({
    addressOrName: props.nftLearnWeb3Address,
    contractInterface: erc721ABI,
    signerOrProvider: provider,
  });

  const BuildSpaceContract = useContract({
    addressOrName: props.nftBuildSpaceAddress,
    contractInterface: erc721ABI,
    signerOrProvider: provider,
  });

  // Function to update NFT details from the contract
  async function updateTokenURI() {
    setLoading(true);
    try {
      // map through the POKNfts and update the image fields
      if (props.nftLearnWeb3Address) {
        const updatedLearnWeb3NFTs = learnWeb3NFTs.map(async (l, i) => {
          //TODO: Fix CORS related issued and enable this
          let tokenURI = await LearnWeb3Contract.tokenURI(i);

          // If it's an IPFS URI, replace it with an HTTP Gateway link
          tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
          
          // Fetch the metadata given the tokenURI
          const metadata = await fetch(tokenURI);
          const metadataJSON = await metadata.json();

          // Extract the image URI from the metadata
          // TODO: Confirm if the metadata in leanweb3 is denoted as image or imageURl
          let image = metadataJSON.image;

          // If it's an IPFS URI, replace it with an HTTP Gateway link
          image = image.replace("ipfs://", "https://ipfs.io/ipfs/");

          // Add the image field to the skillNft
          l['image'] = image;    
        });
        setLearnWeb3NFTs(updatedLearnWeb3NFTs);
      }

      if (props.nftBuildSpaceAddress) {
        const updatedBuildSpaceNFTs = buildSpaceNFTs.map(async (l, i) => {
          //TODO: Fix CORS related issued and enable this
          let tokenURI = await BuildSpaceContract.tokenURI(i);
           
          // If it's an IPFS URI, replace it with an HTTP Gateway link
          tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
           
           // Fetch the metadata given the tokenURI
           const metadata = await fetch(tokenURI);
           const metadataJSON = await metadata.json();
 
           // Extract the image URI from the metadata
           // TODO: Confirm if the metadata in leanweb3 is denoted as image or imageURl
           let image = metadataJSON.image;
 
           // If it's an IPFS URI, replace it with an HTTP Gateway link
           image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
 
           // Add the image field to the skillNft
           l['image'] = image;
           
        });
        setBuildspaceNFTs(updatedBuildSpaceNFTs);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  console.log('updatedBuildSpaceNFTs: ', buildSpaceNFTs);
  console.log('learnWeb3NFTs: ', learnWeb3NFTs);

  useEffect(() => {
    if (isConnected && address) {
      updateTokenURI();
      setLoading(false);
    }
  
  }, [isConnected, address]);

  return (
    <Box as={Container} maxW="5xl" mt={14} p={4}>
      <Box>
        <Text>LearnWeb3 Graduate Experience</Text>
      </Box>
      {loading && props.nftLearnWeb3Address ? (
        <Box>Loading...</Box>
      ) : (<Flex gap={"1rem"} overflowX={"auto"} width={"100%"}>
      <SimpleGrid columns={[6, null]} spacing="20px" boxShadow={"2xl"} ml={2}>
          {/*Insert learnweb3 here before cors here */}
      </SimpleGrid>
    </Flex>)}
      
      <Divider mt={12} mb={12} />
      <Box>
        <Text>Buildspace Proof of knowledge</Text>
      </Box>
      {loading && props.nftBuildSpaceAddress ? (<Box>Loading... </Box>) : (
        <Flex gap={"1rem"} overflowX={"auto"} width={"100%"}>
        <SimpleGrid columns={[6, null]} spacing="20px" boxShadow={"2xl"} ml={2}>
          {/*Insert Buildspace before cors here */}
        </SimpleGrid>
      </Flex>
      )}
      
    </Box>
  );
}
