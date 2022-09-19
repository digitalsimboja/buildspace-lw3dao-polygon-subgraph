import axios from "axios";
import {
  Box,
  Container,
  chakra,
  SimpleGrid,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import Image from "next/image";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import { SUBGRAPH_URL } from "../../constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProfileNFTs({ users }) {
  const router = useRouter();
  //const walletId = router.query.walletId;

  // State variables
  const [learnWeb3NFTs, setLearnWeb3NFTs] = useState([]);
  const [bldSpaceNFTs, setBldSpaceNFTS] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const get_url_extension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };

  useEffect(() => {
    async function filterLearnWeb3NFT() {
      // Get the learnWeb3NFT from the data returned from the subgraph
      let learnWeb3Media = await users[0]["skillNFTs"].filter(
        (l, i) => l.organization === "LearnWeb3GraduatesNFT"
      );
      // Resolve the metadata to extract the URI of the NFT
      const learnWeb3NFTs = await handleLearnWeb3NFTs(learnWeb3Media);
      if (!learnWeb3NFTs) {
        setIsLoading(true);
      } else {
        // Set the state variable for returning to the frontend and the loading state to `false`
        setLearnWeb3NFTs(learnWeb3NFTs);
        setIsLoading(false);
      }
    }
    async function filterBLDSpaceNFT() {
      // Get the bldSpaceNFT from the data returned from the subgraph
      let bldSpaceMedia = await users[0]["skillNFTs"].filter(
        (l, i) => l.organization === "buildspace"
      );
      // Resolve the metadata to extract the URI of the NFT
      const bldSpaceNFTs = await handleBLDSpaceNFTs(bldSpaceMedia);
      if (!bldSpaceNFTs) {
        setIsLoading(true);
      } else {
        // Set the state variable for returning to the frontend and the loading state to `false`
        setBldSpaceNFTS(bldSpaceNFTs);
        setIsLoading(false);
      }
    }
    if (users && router.query.walletId) {
      // Call the filtering functions only when users data from the subgraph becomes available
      filterLearnWeb3NFT();
      filterBLDSpaceNFT();
    } else {
      setIsLoading(true);
    }
  }, [users, router]);

  async function handleLearnWeb3NFTs(...learnWeb3NFTs) {
    // Handle the tokenURI
    const response = await Promise.all(
      learnWeb3NFTs
        .flatMap((item) => item.flatMap((x) => x))
        .map(async (d, i) => {
          const tokenURI = await d.tokenURI.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          );

          const { data } = await axios.get(tokenURI);
          const imageURI = data.image.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          );
          data.image = imageURI;

          return data;
        })
    );
    const learnWeb3NFTsURI = response.map((res) => res.image);

    return learnWeb3NFTsURI;
  }

  async function handleBLDSpaceNFTs(...bldSpaceNFTs) {
    // Handle the tokenURI
    const response = await Promise.all(
      bldSpaceNFTs
        .flatMap((item) => item.flatMap((x) => x))
        .map(async (d, i) => {
          const tokenURI = await d.tokenURI.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          );
          const { data } = await axios.get(tokenURI);
          return data;
        })
    );
    const bldSpaceNFTsURI = response.map((res) => res.image);

    return bldSpaceNFTsURI;
  }

  // Check for image or video nft
  const isImage = ["gif", "jpg", "jpeg", "png"]; //you can add more
  const isVideo = ["mpg", "mp2", "mpeg", "mpe", "mpv", "mp4"];

  function DisplayLearnWeb3ImageNFT(url, index) {
    return (
      <Box key={index} url={url} height="150px" rounded={"2xl"} mb={12}>
        <Image
          alt="LearnWeb3 Graduate NFT"
          src={url.url}
          rounded={"2xl"}
          width="0"
          height="0"
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
    );
  }

  return (
    <>
      {/* Insert the Navbar and Header */}
      <Navbar />
      <Header />

      {isLoading ? (
        <Box p={6} justifyContent={"center"} alignItems={"center"} mt={20}>
          <Box
            position={"absolute"}
            top={"50%"}
            left={"50%"}
            mt={"100px"}
            ml={"-50px"}
            w={"100px"}
            h={"100px"}
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Box>
        </Box>
      ) : (
        <Box>
          <Box as={Container} maxW="7xl" mt={5} p={4}>
            <Divider mt={12} mb={2} />
            <chakra.h3 mb={4}>LearnWeb3GraduatesNFT Image NFTs</chakra.h3>
            <SimpleGrid columns={[2, null, 4]} spacing="40px" mb={4}>
              {learnWeb3NFTs &&
                learnWeb3NFTs.map((url, index) => {
                  const extension = get_url_extension(url);
                  if (isImage.includes(extension)) {
                    return <DisplayLearnWeb3ImageNFT url={url} key={index} />;
                  } else {
                    return null;
                  }
                })}
            </SimpleGrid>
            <Divider mt={12} mb={2} />
            <chakra.h3>LearnWeb3GraduatesNFT Video NFTs</chakra.h3>
            <SimpleGrid
              columns={[2, null, 4]}
              spacing="40px"
              h={"200px"}
              mb={4}
            >
              {learnWeb3NFTs &&
                learnWeb3NFTs.map((url, index) => {
                  const extension = get_url_extension(url);
                  if (isVideo.includes(extension)) {
                    return (
                      <Box
                        key={index}
                        url={url}
                        bg="tomato"
                        height="200px"
                        rounded={"2xl"}
                      ></Box>
                    );
                  } else {
                    return null;
                  }
                })}
            </SimpleGrid>
          </Box>

          <Box as={Container} maxW="7xl" mt={5} p={4}>
            <Divider mt={12} mb={2} />
            <chakra.h3>BuildSpace Image</chakra.h3>
            <SimpleGrid columns={[2, null, 4]} spacing="40px" mb={4}>
              {bldSpaceNFTs &&
                bldSpaceNFTs.map((url, index) => {
                  const extension = get_url_extension(url);
                  if (isImage.includes(extension)) {
                    return (
                      <Box
                        key={index}
                        url={url}
                        bg="tomato"
                        height="200px"
                        rounded={"2xl"}
                      ></Box>
                    );
                  } else {
                    return null;
                  }
                })}
            </SimpleGrid>

            <Divider mt={12} mb={12} />
            <chakra.h3>BuildSpace Video NFTs</chakra.h3>
            <SimpleGrid columns={[2, null, 4]} spacing="40px" mb={4}>
              {bldSpaceNFTs &&
                bldSpaceNFTs.map((url, index) => {
                  const extension = get_url_extension(url);
                  if (isVideo.includes(extension)) {
                    return (
                      <Box
                        key={index}
                        url={url}
                        bg="tomato"
                        height="200px"
                        rounded={"2xl"}
                      ></Box>
                    );
                  } else {
                    return null;
                  }
                })}
            </SimpleGrid>
          </Box>
          <Divider mt={20} mb={2} />
        </Box>
      )}
    </>
  );
}

// Get the Data from Apolloclient with getStatic props
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true, // See the "fallback" section below
  };
}

export async function getStaticProps(context) {
  const walletId = context.params?.walletId;

  const appolloClient = new ApolloClient({
    uri: SUBGRAPH_URL,
    cache: new InMemoryCache(),
  });

  const { data } = await appolloClient.query({
    query: gql`
      query getUserNFTs {
        users(id: "${walletId}") {
          id
          skillNFTs {
            id
            organization
            tokenURI
            tokenId
          }
        }
      }
    `,
  });

  return {
    props: {
      users: data.users,
    },
  };
}
