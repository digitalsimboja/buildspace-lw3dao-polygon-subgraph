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

export default function Listing(props) {
  // Extract the user wallet address from the URL
  const router = useRouter();
  const walletId = router.query.walletId;

  // state variables to hold the NFT images
  const [bldSpaceImages, setBldSpaceImages] = useState([]);
  const [learnWeb3Images, setLearnWeb3Images] = useState([]);

  // loading state
  const [learnWeb3Loading, setLearnWeb3Loading] = useState(true);
  const [buildSpaceLoading, setBuildSpaceLoading] = useState(true);

  // Get the provider, connected address and a contract instance
  // for the NFT contract using wagmi
  const provider = useProvider();
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

  // function to await props values
  const updateLearnWeb3State = async () => {
    const lWeb3 = await props.learnWeb3;
    return lWeb3;
  };

  const updateBuildSpaceState = async () => {
    const bld = await props.buildSpace;
    return bld;
  };

  // Function to update LearnWeb3DAO NFT details from the contract
  async function updateLearnWeb3NFTsTokenURI() {
    // map through the POKNfts and update the image fields
    const learnWeb3NFTs = await updateLearnWeb3State();

    console.log("learnWeb3NFTs", learnWeb3NFTs);
    if (props.nftLearnWeb3Address && learnWeb3NFTs !== undefined) {
      learnWeb3NFTs.map(async (l, i) => {
        try {
          // Get token URI from contract
          let tokenURI = await LearnWeb3Contract.tokenURI(i);

          // If it's an IPFS URI, replace it with an HTTP Gateway link
          tokenURI = await tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

          // Resolve the Token URI
          const metadata = await fetch(tokenURI);
          const metadataJSON = await metadata.json();

          // Extract image URI from the metadata
          let image = await metadataJSON.image;
          image = await image.replace("ipfs://", "https://ipfs.io/ipfs/");

          setLearnWeb3Images((learnWeb3Images) => [...learnWeb3Images, image]);
        } catch (error) {
          console.error(error);
        }
      });
    }
  }

  // Function to update Buildspace NFT details from the contract
  async function updateBuildSpaceNFTsTokenURI() {
    // map through the POKNfts and update the image fields
    const buildSpaceNFTs = await updateBuildSpaceState();

    console.log("buildSpaceNFTs", buildSpaceNFTs);
    if (props.nftBuildSpaceAddress && buildSpaceNFTs !== undefined) {
      buildSpaceNFTs.map(async (l, i) => {
        try {
          // Get token URI from contract
          let tokenURI = await BuildSpaceContract.tokenURI(i);

          // If it's an IPFS URI, replace it with an HTTP Gateway link
          tokenURI = await tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

          // Resolve the Token URI
          const metadata = await fetch(tokenURI);
          const metadataJSON = await metadata.json();

          // Extract image URI from the metadata
          let image = await metadataJSON.image;
          image = await image.replace("ipfs://", "https://ipfs.io/ipfs/");

          /// Update state variables
          setBldSpaceImages((bldSpaceImages) => [...bldSpaceImages, image]);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      });
    }
  }

  console.log("learnWeb3Images", props.learnWeb3);
  console.log("bldSpaceImages", props.buildSpace);

  const goHome = async () => {
    return router.push("/");
  };

  // Load listing and NFT data on page load
  // Update the tokenURI when component is loaded
  useEffect(() => {
    // if query from subgraph is in loading state or we received an empty object
    if (Object.keys(props.learnWeb3).length === 0) {
      setBldSpaceImages(...bldSpaceImages, []);
      setLearnWeb3Loading(true);
    }
    if (Object.keys(props.buildSpace).length === 0) {
      setBldSpaceImages(...bldSpaceImages, []);
      setBuildSpaceLoading(true);
    }

    // Update NFT is ready
    if (Object.keys(props.learnWeb3).length !== 0) {
      updateLearnWeb3NFTsTokenURI();
      setLearnWeb3Loading(false);
    }
    if (Object.keys(props.buildSpace).length !== 0) {
      updateBuildSpaceNFTsTokenURI();
      setBuildSpaceLoading(false);
    }
    // if User disconnects, goHome()
    if (!isConnected || !provider) {
      goHome();
    }
  }, []);

  const isImage = [".gif", ".jpg", ".jpeg", ".png"]; //you can add more
  const isVideo = [".mpg", ".mp2", ".mpeg", ".mpe", ".mpv", ".mp4"];

  return (
    <Box as={Container} maxW="5xl" mt={14} p={4}>
      <Box>
        <Text>LearnWeb3 Graduate Experience</Text>
      </Box>
      <Flex gap={"1rem"}>
        <SimpleGrid columns={[6, null]} spacing="20px">
          {/* check if LeaarWeb3 Images and or videos are in Loading state, else display the images */}
          {!learnWeb3Loading
            ? learnWeb3Images.map((nft, i) => (
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
                </Flex>
              ))
            : learnWeb3Images.map((nft, i) => (
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
                  {/* Render video if not image loading state */}
                  {isImage?.includes(nft) ? (
                    <img src={<Spinner />} alt="" />
                  ) : (
                    <Box
                      rounded="2xl"
                      as="iframe"
                      src={<Spinner />}
                      width="100%"
                      sx={{
                        aspectRatio: "16/9",
                      }}
                    />
                  )}
                </Flex>
              ))}
        </SimpleGrid>
      </Flex>

      <Divider mt={12} mb={12} />

      <Box>
        <Text>Buildspace Proof of knowledge</Text>
      </Box>
      <Flex gap={"1rem"}>
        <SimpleGrid columns={[6, null]} spacing="20px">
          {/* check if BuildSpace images and or videos are in Loading state, else display the images */}
          {!buildSpaceLoading
            ? bldSpaceImages.map((nft, i) => (
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
                  {/* Render video if not image */}
                  {isImage?.includes(nft) ? (
                    <img src={nft} />
                  ) : (
                    <Box
                      as="iframe"
                      src={nft}
                      width="100%"
                      rounded="2xl"
                      sx={{
                        aspectRatio: "16/9",
                      }}
                    />
                  )}
                </Flex>
              ))
            : bldSpaceImages.map((nft, i) => (
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
                  {/* Render video if not image loading state */}
                  {isImage?.includes(nft) ? (
                    <img src={<Spinner />} alt="" />
                  ) : (
                    <Box
                      rounded="2xl"
                      as="iframe"
                      src={<Spinner />}
                      width="100%"
                      sx={{
                        aspectRatio: "16/9",
                      }}
                    />
                  )}
                </Flex>
              ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
}
