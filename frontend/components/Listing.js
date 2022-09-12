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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  erc721ABI,
  useAccount,
  useContract,
  useProvider,
  useSigner,
} from "wagmi";

export default function Listing(props) {
  // Extract the user wallet address from the URL
  const router = useRouter();
  const walletId = router.query.walletId;
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
  async function updatelearnWeb3NFTsTokenURI() {
    // map through the POKNfts and update the image fields
    if (props.nftLearnWeb3Address) {
      const updatedLearnWeb3NFTs = learnWeb3NFTs.map(async (l, i) => {
        try {
          //TODO: Fix CORS related issued and enable this
        //let tokenURI = await LearnWeb3Contract.tokenURI(i);
        let tokenURI = await l.tokenURI;

        tokenURI = await tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

        const metadata = await fetch(tokenURI);
        const metadataJSON = await metadata.json();

        let image = await metadataJSON.image;
        image = await  image.replace("ipfs://", "https://ipfs.io/ipfs/");

        // Replace the tokenURI with the updated image url
        l.tokenURI =  await image;

        } catch (error) {
          console.error(error);
        }
        
      });
      // update the state variables
      setLearnWeb3NFTs(updatedLearnWeb3NFTs);
 
    }
  }

  // Function to update NFT details from the contract
  async function updatebuildSpaceNFTsTokenURI() {
    // map through the POKNfts and update the image fields
    if (props.nftBuildSpaceAddress) {
      const updatedBuildSpaceNFTs = buildSpaceNFTs.map(async (l, i) => {
        try {
           //TODO: Fix CORS related issued and enable this
        //let tokenURI = await BuildSpaceContract.tokenURI(i);
        let tokenURI = await l.tokenURI;

        tokenURI = await tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

        const metadata = await fetch(tokenURI);
        const metadataJSON = await metadata.json();

        let image = await metadataJSON.image;
        image = await image.replace("ipfs://", "https://ipfs.io/ipfs/");

        // Replace the tokenURI with the updated image url
        l.tokenURI = await image;

        } catch (error) {
          console.error(error);
        }
       
      });
      setBuildspaceNFTs(updatedBuildSpaceNFTs);
     
    }
  }

  async function goHome() {
    return router.push("/");
  }

 // Load listing and NFT data on page load
 useEffect(() => {
  if (isConnected && router.query.walletId) {
      updatelearnWeb3NFTsTokenURI();
  } else {
    goHome();
  }
}, [isConnected], router);

  useEffect(() => {
    if (isConnected && router.query.walletId) {
      updatebuildSpaceNFTsTokenURI();
    } else {
      goHome();
    }
  }, [isConnected, router]);

  return (
    <Box as={Container} maxW="5xl" mt={14} p={4}>
      <Box>
        <Text>LearnWeb3 Graduate Experience</Text>
      </Box>
      {props.learnWeb3 ? (
        <SimpleGrid columns={[6, null]} spacing="20px">
          {learnWeb3NFTs.map((skill, i) => {
            <Flex key={i} flexDir={"column"}>
              <Image src={""} alt="Loading..." />
            </Flex>;
          })}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={[6, null]} spacing="20px">
          {learnWeb3NFTs.map((skill, i) => {
            <Flex key={i} flexDir={"column"}>
              <Image src={skill.image} />
            </Flex>;
          })}
        </SimpleGrid>
      )}

      <Divider mt={12} mb={12} />
      <Box>
        <Text>Buildspace Proof of knowledge</Text>
      </Box>
      {props.buildSpace ? (
        <SimpleGrid columns={[6, null]} spacing="20px">
          {buildSpaceNFTs.map((skill, i) => {
            <Flex key={i} flexDir={"column"}>
              <Image src={""} alt="Loading..." />
            </Flex>;
          })}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={[6, null]} spacing="20px">
          {buildSpaceNFTs.map((skill, i) => {
            <Flex key={i} flexDir={"column"}>
              <Image src={skill.image} />
            </Flex>;
          })}
        </SimpleGrid>
      )}
    </Box>
  );
}
