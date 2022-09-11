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
import { erc721ABI, useAccount, useContract, useProvider } from "wagmi";
import useSwr from "swr";
import Navbar from "../../components/Navbar";
import Listing from "../../components/Listing";
import { SUBGRAPH_URL } from "../../constants";
import {
  BUILDSPACE_ADDRESS,
  LEARNWEB3DAOGRADUATENFT_ADDRESS,
} from "../../constants";
import { SKILLNFTS } from "../../data";

const fetcher = (query) =>
  fetch("/api/profiles[walletId]", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data);

export default function ProofOfKnowledgeDetails() {
  // Extract the user wallet address from the URL
  const router = useRouter();
  const walletId = router.query.walletId;

  // state variables to contain the userSkillsNfts
  const [skills, setSkills] = useState(SKILLNFTS);

  // State variables to contain loading state
  const [loading, setLoading] = useState(true);

  const { isConnected } = useAccount();

  // Get the connected address
  const { address } = useAccount();

  // Function to fetch userSkillsNfts and set the user's skills
  async function fetchUserSkillsNfts() {
    if (address !== "") {
      setLoading(true);

      // Creae a urql client
      const urqlClient = createClient({
        url: SUBGRAPH_URL,
      });

      // The GraphQL query to run
      const userSkillsNftsQuery = `query fetchUserSkillsNftsEnitites {
        users (where: {id: "${walletId}"}) {
          skillsNft {
            name
            organization
            metadata
          }
        }
      }`;

      // Send the query to the subgraph GraphQL API, and get the response
      const response = await urqlClient.query(userSkillsNftsQuery).toPromise();

      console.log(response);
      const userSkillsNftsEntities = response.fetchUserSkillsNftsEnitites;

      // Update the state variables
      // TODO: filter by organization
      //let buildSpaceNFTs = userSkillsNftsEntities.filter()
      setSkills(userSkillsNftsEntities);
      console.log("User skills:", userSkillsNftsEntities);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isConnected && router.query.walletId) {
      //fetchUserSkillsNfts();
      setSkills[SKILLNFTS];
      //setLoading(false);
    } /*else {
      setLoading(true);
    }*/
  }, [isConnected]);

  return (
    <>
      {/* Add a Navbar */}
      <Navbar />
      <Box as={Container} maxW="5xl" p={4}>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={4}
          w={"full"}
          bg={useColorModeValue("#378490", "gray:800")}
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

        {/* Show the listing of the proof of knowledge */}
        <Listing skills={skills} />
      </Box>
    </>
  );
}
