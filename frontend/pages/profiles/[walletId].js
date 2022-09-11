import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
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
import { SUBGRAPH_URL } from "../../constants";

const fetcher = (query) =>
  fetch('/api/profiles[walletId]', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data)

export default function ProofOfKnowledgeDetails() {
  // Extract the user wallet address from the URL
  const router = useRouter();
  const walletId = router.query.walletId;

  // state variables to contain the userSkillsNfts
  const [skills, setSkills] = useState();

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
      setSkills(userSkillsNftsEntities);
      console.log("User skills:", userSkillsNftsEntities);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isConnected && router.query.walletId) {
      fetchUserSkillsNfts();
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [isConnected]);

  return (
    <>
      {/* Add a Navbar */}
      <Navbar />
    </>
  );
}
