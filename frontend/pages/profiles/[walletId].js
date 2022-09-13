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
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useQuery, gql } from "@apollo/client";
import { useAccount } from "wagmi";
import Navbar from "../../components/Navbar";
import Listing from "../../components/Listing";

import {
  BUILDSPACE_ADDRESS,
  LEARNWEB3DAOGRADUATENFT_ADDRESS,
} from "../../constants";

/*/ The GraphQL query to run
const profilesQuery = gql`
  query fetchUserSkillsNftsEnitites {
    users(id: $id) {
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
*/

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
  const router = useRouter();
  const walletId = router.query.walletId;
  const { isConnected } = useAccount();

  const goHome = async () => {
    return router.push("/");
  };

  // ensure walletId exists and user is connected
  if (isConnected && walletId) {
    //  Query the graph and get a response
    //const { loading, data, error } = useQuery(profilesQuery, {variables: {id: {walletId}}});
    const { loading, data, error } = useQuery(profilesQuery);

    if (error) {
      console.error(error);
    }
    if (loading) {
      // If the NFT Data is not ready, handle loading state
      return (
        <>
          {/* Insert Navbar */}
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
            {/* Display the listing  loading state of NFT skills */}
            <Listing
              nftLearnWeb3Address={{}}
              nftBuildSpaceAddress={{}}
              learnWeb3={{}}
              buildSpace={{}}
            />
          </Box>
        </>
      );
    }
    if (data) {
      // extract user NFTs from data
      const extractedSkillNFTs = data.users[0]["skillNFTs"];

      // perform data filtering here to avoid race condition in the return stattement
      const filterData = async (listing = [], strItem = "") => {
        let filterdData = listing.filter((l) => l.organization === { strItem });
        return filterdData;
      };

      const updateNFTs = async () => {
        // Filter for 'buildspace' and LearnWeb3 NFTs
        let buildspaceNFTs = await filterData(extractedSkillNFTs, "buildspace");
        let learnWeb3NFTs = await filterData(
          extractedSkillNFTs,
          "LearnWeb3GraduatesNFT"
        );
        return [buildspaceNFTs, learnWeb3NFTs];
      };

      const updatedNFTs = updateNFTs();
      console.log(
        "Extracted list values after filtering for Buildspace: ",
        updatedNFTs
      );

      // Extract the list values
      const bldNFTS = updatedNFTs[0];
      const lweb3NFTs = updatedNFTs[1];

      console.log(
        "Extracted list values after filtering for Buildspace: ",
        bldNFTS
      );
      console.log(
        "Extracted list values after filtering for Learnweb3: ",
        lweb3NFTs
      );

      // If LearnWeb3 and BuildSpace NFTs become available
      if (bldNFTS && lweb3NFTs) {
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
                learnWeb3={lweb3NFTs}
                buildSpace={bldNFTS}
              />
            </Box>
          </>
        );
      }
    }
  }
}
