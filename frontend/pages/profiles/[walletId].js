import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  chakra,
  Divider,
  Image,
  Grid,
  GridItem,
  VStack,
  Container,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { Contract } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createClient } from "urql";
import { useQuery, gql } from "@apollo/client";
import { erc721ABI, useAccount, useContract, useProvider } from "wagmi";
import useSwr from "swr";
import Navbar from "../../components/Navbar";
import Listing from "../../components/Listing";
import { SUBGRAPH_URL } from "../../constants";
import {
  BUILDSPACE_ADDRESS,
  LEARNWEB3DAOGRADUATENFT_ADDRESS,
} from "../../constants";

// The GraphQL query to run
const profilesQuery = gql`
  query fetchUserSkillsNftsEnitites {
    users(where: { id: "0x083fe503ea4e6319bf5fd710316124a36e13bda9" }) {
      id
      skillNFTs {
        id
        organization
        tokenURI
        tokenId
      }
    }
  }
`;

export default function ProofOfKnowledgeDetails() {
  // state variables to manage loading
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const walletId = router.query.walletId;
  const { isConnected } = useAccount();

  const { loading, data, error } = useQuery(profilesQuery);

  if (error) {
    console.error(error);
  }

  if (!loading && !error && data) {
    const extractedSkillNFTs = data.users[0]["skillNFTs"];

    let buildspaceNFTs = extractedSkillNFTs.filter(
      (l) => l.organization === "buildspace"
    );

    let learnWeb3NFTs = extractedSkillNFTs.filter(
      (l) => l.organization === "LearnWeb3GraduatesNFT"
    );


    return (
      <>
        {/* Add the Navbar */}
        <Navbar />
        <Box
          rounded={"3xl"}
          as={Container}
          maxW="5xl"
          p={4}
          h="200px"
          bgGradient="linear(to-l, #7928CA, #FF0080)"
        >
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
            }}
            gap={4}
            w={"full"}
          >
            <GridItem colSpan={1}>
              <VStack alignItems="flex-start" spacing="20px">
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  src="https://bit.ly/dan-abramov"
                  alt="Dan Abramov"
                />
                <Box p={6}>
                  <Stack spacing={0} align={"center"} mb={5}>
                    <Heading
                      fontSize={"2xl"}
                      fontWeight={500}
                      fontFamily={"body"}
                    >
                      John Doe
                    </Heading>
                    <Text color={"gray:500"}>Fullstack Developer</Text>
                  </Stack>
                </Box>
              </VStack>
            </GridItem>
            <GridItem>
              <Flex>
                <chakra.h1 fontSize={"3xl"}></chakra.h1>
              </Flex>
            </GridItem>
          </Grid>
          <Divider mt={12} mb={12} />
          {/* Display the listing of NFT skills */}
          <Listing
            nftLearnWeb3Address={LEARNWEB3DAOGRADUATENFT_ADDRESS}
            nftBuildSpaceAddress={BUILDSPACE_ADDRESS}
            learnWeb3={learnWeb3NFTs}
            buildSpace={buildspaceNFTs}
          />
        </Box>
      </>
    );
  }
}

