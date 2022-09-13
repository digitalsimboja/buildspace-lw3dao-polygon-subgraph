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
  Spinner,
  Progress,
} from "@chakra-ui/react";
import {} from "@chakra-ui/react";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  erc721ABI,
  useAccount,
  useContract,
  useProvider,
  useSigner,
} from "wagmi";

export default function Listing({
  id,
  organization,
  tokenURI,
  nftLearnWeb3Address,
  nftBuildSpaceAddress,
}) {
  // Extract the user wallet address from the URL
  const router = useRouter();
  const walletId = router.query.walletId;

  // state variables to hold the NFT images
  const [bldSpaceImages, setBldSpaceImages] = useState([]);
  const [learnWeb3Images, setLearnWeb3Images] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Get the provider, connected address and a contract instance
  // for the NFT contract using wagmi
  const provider = useProvider();
  const { address } = useAccount();
  const { isConnected } = useAccount();

  // The contract instance for both Buildspace and Learnweb3
  const LearnWeb3Contract = useContract({
    addressOrName: nftLearnWeb3Address,
    contractInterface: erc721ABI,
    signerOrProvider: provider,
  });

  const BuildSpaceContract = useContract({
    addressOrName: nftBuildSpaceAddress,
    contractInterface: erc721ABI,
    signerOrProvider: provider,
  });

  // Fetch NFT details from the contract
  async function fetchLearnWeb3NFT() {
    try {
      if (organization === "LearnWeb3GraduatesNFT") {
        // Get token URI from contract
        let tokenURI = await LearnWeb3Contract.tokenURI(0);

        // If it's an IPFS URI, replace it with an HTTP Gateway link
        tokenURI = await tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

        // Resolve the Token URI
        const metadata = await fetch(tokenURI);
        const metadataJSON = await metadata.json();

        // Extract image URI from the metadata
        let image = await metadataJSON.image;
        image = await image.replace("ipfs://", "https://ipfs.io/ipfs/");

        setLearnWeb3Images((learnWeb3Images) => [...learnWeb3Images, image]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch NFT details from the contract
  async function fetchLearnBldSpaceNFT() {
    try {
      if (organization === "buildspace") {
        // Get token URI from contract
        let tokenURI = await BuildSpaceContract.tokenURI(0);

        // If it's an IPFS URI, replace it with an HTTP Gateway link
        tokenURI = await tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

        // Resolve the Token URI
        const metadata = await fetch(tokenURI);
        const metadataJSON = await metadata.json();

        // Extract image URI from the metadata
        let image = await metadataJSON.image;
        image = await image.replace("ipfs://", "https://ipfs.io/ipfs/");

        setLearnWeb3Images((bldSpaceImages) => [...bldSpaceImages, image]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const goHome = async () => {
    return router.push("/");
  };

  // Load listing and NFT data on page load
  // Update the tokenURI when component is loaded
  useEffect(() => {
    {
      /* use Promise.all */
    }
    if (router.query.walletId && provider) {
      Promise.all([fetchLearnWeb3NFT(), fetchLearnBldSpaceNFT()]).finally(
        () => {
          setLoading(false);
        }
      );
    }
    // if User disconnects, goHome()
    if (!isConnected || !provider) {
      goHome();
    }
  }, [organization, provider]);

  const isImage = [".gif", ".jpg", ".jpeg", ".png"]; //you can add more
  const isVideo = [".mpg", ".mp2", ".mpeg", ".mpe", ".mpv", ".mp4"];

  console.log({
    learnWeb3Images: learnWeb3Images,
    bldSpaceImages: bldSpaceImages,
  });

  return (
    <Box as={Container} maxW="5xl" mt={14} p={4}>
      <Box>
        <Text>LearnWeb3 Graduate Experience</Text>
      </Box>
      {/* Insert Learnweb3 NFT here */}
      <Flex gap={"1rem"}>
        <SimpleGrid columns={[6, null]} spacing="20px">
          {/* If loading is false, then load LearnWeb3 NFT */}
          {loading ? (
            <Progress hasStripe value={64}  />
          ) :  (learnWeb3Images &&
            learnWeb3Images.map((nft, i) => {
              <Flex
                key={i}
                rounded="2xl"
                flexDir={"column"}
                bgColor="gray"
                p={"2rem"}
                gap="1rem"
                color={"#fff"}
                justify="space-between"
              >
                {/* Check if nft is image(TODO!: We could display image and video separately) */}
                {isImage?.includes(nft) ? (
                  <img src={nft} />
                ) : (
                  <Box
                    rounded="2xl"
                    as="iframe"
                    src={nft}
                    width="100%"
                    sx={{
                      aspectRatio: "16/9",
                    }}
                  />
                )}
              </Flex>;
            }))}
        </SimpleGrid>
      </Flex>

      <Divider mt={12} mb={12} />

      <Box>
        <Text>Buildspace Proof of knowledge</Text>
      </Box>
      <Flex gap={"1rem"}>
      <SimpleGrid columns={[6, null]} spacing="20px">
          {/* If loading is false, then load LearnWeb3 NFT */}
          {loading ? (
            <Progress hasStripe value={64}  />
          ) :  (bldSpaceImages &&
            bldSpaceImages.map((nft, i) => {
              <Flex
                key={i}
                rounded="2xl"
                flexDir={"column"}
                bgColor="gray"
                p={"2rem"}
                gap="1rem"
                color={"#fff"}
                justify="space-between"
              >
                {/* Check if nft is image(TODO!: We could display image and video separately) */}
                {isImage?.includes(nft) ? (
                  <img src={nft} />
                ) : (
                  <Box
                    rounded="2xl"
                    as="iframe"
                    src={nft}
                    width="100%"
                    sx={{
                      aspectRatio: "16/9",
                    }}
                  />
                )}
              </Flex>;
            }))}
        </SimpleGrid>
        
      </Flex>
    </Box>
  );
}
