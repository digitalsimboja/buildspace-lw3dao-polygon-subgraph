import {
  Box,
  Container,
  chakra,
  Grid,
  Progress,
  GridItem,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useQuery, gql } from "@apollo/client";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import { useProvider } from "wagmi";
import { useEffect } from "react";

// Get the provider, connected address and a contract instance
// for the NFT contract using wagmi

//The GraphQL query to run
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


// Fetch NFT details from the contract
async function updateTokenURI(tokenURI) {
  try {

    // If it's an IPFS URI, replace it with an HTTP Gateway link
    tokenURI = await tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

    // Resolve the Token URI
    const metadata = await fetch(tokenURI);
    const metadataJSON = await metadata.json();

    // Extract image URI from the metadata
    let image = await metadataJSON.image;
    image = await image.replace("ipfs://", "https://ipfs.io/ipfs/");

    return image;
  } catch (error) {
    console.error(error);
  }
}

const DisplayBLDSpaceNFT = ({ organization, tokenURI }) => {
  if (organization === "buildspace") {
    return (
      <GridItem>
        <chakra.h3 fontSize="xl" fontWeight="600">
          {organization}
        </chakra.h3>
        <chakra.p>{tokenURI}</chakra.p>
      </GridItem>
    );
  }
};

const DisplayLearnWeb3NFT = ({ organization, tokenURI }) => {
  return (
    <GridItem>
      <chakra.h3 fontSize="xl" fontWeight="600">
        {organization}
      </chakra.h3>
      <chakra.p>{tokenURI}</chakra.p>
    </GridItem>
  );
};
/*
useEffect(() => {
  //Update the tokenURI based on who issued it
  //updateURI(tokenURI)

}, [])
*/

export default function ProofOfKnowledgeDetails() {
  const router = useRouter();
  const walletId = router.query.walletId;

  // Get the provider, connected address and a contract instance
  // for the NFT contract using wagmi
  const provider = useProvider();

  //  Query the graph and get a response
  const { loading, data, error } = useQuery(profilesQuery, {variables: {id: {walletId}}});


  if (error) {
    console.log(error);
  }

  return (
    <>
      <Box>
        <Navbar />
        <Header />
        {loading ? (
          <Box>
            <Progress hasStripe value={64} />
          </Box>
        ) : (
          <Box as={Container} maxW="7xl" mt={14} p={4}>
            <Divider mt={12}  mb={10}/>
            <chakra.h3>LearnWeb3GraduatesNFT Proof of Knowledge</chakra.h3> 
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              }}
              gap={{ base: "8", sm: "12", md: "16" }}
              h={20}
            >
              {data &&
                data.users[0]["skillNFTs"].map(
                  (fetchUserSkillsNftsEnitites, i) => {
                   { if (fetchUserSkillsNftsEnitites.organization ===  "LearnWeb3GraduatesNFT") {
                    return <DisplayLearnWeb3NFT key={i} organization={fetchUserSkillsNftsEnitites.organization}
                    tokenURI={fetchUserSkillsNftsEnitites.tokenURI}  />
                   }}
                  }
                )}
            </Grid>
            
            <Divider mt={12}  mb={10}/>

            <chakra.h3>BuildSpace NFTs</chakra.h3>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              }}
              gap={{ base: "8", sm: "12", md: "16" }}
              h={20}
            >
              {data &&
                data.users[0]["skillNFTs"].map(
                  (fetchUserSkillsNftsEnitites, i) => {
                    {if (fetchUserSkillsNftsEnitites.organization === "buildspace") {
                      return <DisplayBLDSpaceNFT key={i} organization={fetchUserSkillsNftsEnitites.organization}
                      tokenURI={fetchUserSkillsNftsEnitites.tokenURI} />
                    }}
                  }
                )}
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
}
