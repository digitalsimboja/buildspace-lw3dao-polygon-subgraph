import {
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useQuery, gql } from "@apollo/client";
import { useAccount } from "wagmi";
import Navbar from "../../components/Navbar";
import Listing from "../../components/Listing";
import Loading from "../../components/Loading";
import Header from "../../components/Header";

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

  //  Query the graph and get a response
  //const { loading, data, error } = useQuery(profilesQuery, {variables: {id: {walletId}}});
  const { loading, data, error } = useQuery(profilesQuery);

  if (error) {
    console.error(error);
  }

  return (
    <Box>
      <Navbar />
      <Header />
      {loading ? (
        <Loading />
      ) : (
        data &&
        data.users[0]["skillNFTs"].map((fetchUserSkillsNftsEnitites, i) => (
         
            <Listing
              key={i}
              id={fetchUserSkillsNftsEnitites.id}
              organization={fetchUserSkillsNftsEnitites.organization}
              tokenURI={fetchUserSkillsNftsEnitites.tokenURI}
              nftLearnWeb3Address={LEARNWEB3DAOGRADUATENFT_ADDRESS}
              nftBuildSpaceAddress={BUILDSPACE_ADDRESS}
            /> 
        ))
      )}
    </Box>
  );
  
}
