import {
  Avatar,
  Box,
  Container,
  chakra,
  Grid,
  Progress,
  GridItem,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useQuery, gql } from "@apollo/client";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import { erc721ABI, useAccount, useContract, useProvider } from "wagmi";

import {
  BUILDSPACE_ADDRESS,
  LEARNWEB3DAOGRADUATENFT_ADDRESS,
} from "../../constants";

// Get the provider, connected address and a contract instance
// for the NFT contract using wagmi

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

// Fetch NFT details from the contract
async function updateTokenURI(nftContract) {
  try {
    // Get token URI from contract
    let tokenURI = await nftContract.tokenURI(0);

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
  /*
  const provider = useProvider();

   // The contract instance for both Buildspace and Learnweb3
 const LearnWeb3Contract = useContract({
  addressOrName: LEARNWEB3DAOGRADUATENFT_ADDRESS,
  contractInterface: erc721ABI,
  signerOrProvider: provider,
});

const BuildSpaceContract = useContract({
  addressOrName: BUILDSPACE_ADDRESS,
  contractInterface: erc721ABI,
  signerOrProvider: provider,
});

 
 
  if (organization === "LearnWeb3GraduatesNFT") {
    let image =  updateTokenURI(LearnWeb3Contract);
    return (
      <GridItem>
        <chakra.h3 fontSize="xl" fontWeight="600">
          {organization}
        </chakra.h3>
        <chakra.p>{image}</chakra.p>
      </GridItem>
    );

  } if (organization === "buildspace") {

    let image = updateTokenURI(BuildSpaceContract);
    return (
      <GridItem>
        <chakra.h3 fontSize="xl" fontWeight="600">
          {organization}
        </chakra.h3>
        <chakra.p>{image}</chakra.p>
      </GridItem>
    );

    
  }
  */
  return (
    <GridItem>
      <chakra.h3 fontSize="xl" fontWeight="600">
        {organization}
      </chakra.h3>
      <chakra.p>{tokenURI}</chakra.p>
    </GridItem>
  );
};

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

  // Get the provider, connected address and a contract instance
  // for the NFT contract using wagmi
  const provider = useProvider();

  const goHome = async () => {
    return router.push("/");
  };

  //  Query the graph and get a response
  //const { loading, data, error } = useQuery(profilesQuery, {variables: {id: {walletId}}});
  const { loading, data, error } = useQuery(profilesQuery);

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
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              }}
              gap={{ base: "8", sm: "12", md: "16" }}
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
            <Divider />

            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              }}
              gap={{ base: "8", sm: "12", md: "16" }}
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
