import axios from "axios";
import {
  Box,
  Container,
  chakra,
  Grid,
  Progress,
  GridItem,
  Divider,
  Spinner,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import { SUBGRAPH_URL } from "../../constants";
import { GetStaticProps, GetStaticPaths } from "next";
import { useEffect, useState } from "react";

export default function ProfileNFTs({ users }) {
  const router = useRouter();
  const walletId = router.query.walletId;

  // State variables
  const [learnWeb3NFTs, setLearnWeb3NFTs] = useState([]);
  const [bldSpaceNFTs, setBldSpaceNFTS] = useState([]);

  const [learnWeb3URI, setLearnWeb3URI] = useState([]);
  const [bldSpaceURI, setBlsSpaceURI] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  async function handleLearnWeb3NFTs() {
    const lweb3 = [];
    learnWeb3NFTs.map(async (nft, i) => {
      let tokenURI = nft.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

      //get the metadata
      const metadata = await axios
        .get(tokenURI)
        .then((response) => response.data)
        .catch((err) => console.error(err));

      //Extract the image
      let media = await metadata.image;
      lweb3.push(media);
    });
    return lweb3;
  }

  const DisplayBLDSpaceNFTImage = ({ nft }) => {
    return (
      <GridItem>
        <img src={nft} alt={"BuildSpace NFT"} />
      </GridItem>
    );
  };

  const DisplayLearnWeb3NFTImage = ({ nft }) => {
    console.log("lweb3", nft);
    return (
      <GridItem>
        <img src={lweb3} alt={"LearnWeb3 Graduate NFT"} />
      </GridItem>
    );
  };

  const DisplayLearnWeb3NFTVideo = ({ lweb3 }) => {
    return (
      <GridItem>
        {/* insert video with chakra */}
        <Box
          rounded="2xl"
          as="iframe"
          src={lweb3}
          width="100%"
          sx={{
            aspectRatio: "16/9",
          }}
        />
      </GridItem>
    );
  };

  const DisplayBLDSpaceNFTVideo = ({ nft }) => {
    return (
      <GridItem>
        {/* insert video with chakra */}
        <Box
          rounded="2xl"
          as="iframe"
          src={nft}
          width="100%"
          sx={{
            aspectRatio: "16/9",
          }}
        />
      </GridItem>
    );
  };

  useEffect(() => {
    async function filterLearnWeb3NFT() {
      let learnWeb3Media = await users[0]["skillNFTs"].filter(
        (l, i) => l.organization === "LearnWeb3GraduatesNFT"
      );
      const learnWeb3NFTs = await handleLearnWeb3NFTs(learnWeb3Media);
      setLearnWeb3NFTs(learnWeb3NFTs);
    }
    async function filterBLDSpaceNFT() {
      let bldSpaceMedia = await users[0]["skillNFTs"].filter(
        (l, i) => l.organization === "buildspace"
      );
      const bldSpaceNFTs = await handleBLDSpaceNFTs(bldSpaceMedia);
      setBldSpaceNFTS(bldSpaceNFTs);
    }
    filterLearnWeb3NFT();
    filterBLDSpaceNFT();
  }, [router]);

  async function handleLearnWeb3NFTs(...learnWeb3NFTs) {
    console.log("Handling tokenURI state of learnWeb3NFTs...", learnWeb3NFTs);

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
          )
          data.image = imageURI
          return data;
        })
    );
    const learnWeb3NFTsURI = response.map((res) => res.image);

    return learnWeb3NFTsURI;
  }

  async function handleBLDSpaceNFTs(...bldSpaceNFTs) {
    console.log("Handling tokenURI state of bldSpaceNFTs...", bldSpaceNFTs);

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
  const isImage = [".gif", ".jpg", ".jpeg", ".png"]; //you can add more
  const isVideo = [".mpg", ".mp2", ".mpeg", ".mpe", ".mpv", ".mp4"];

  console.log("learnWeb3URI for display", learnWeb3NFTs);
  console.log("bldSpaceURI: for display", bldSpaceNFTs);

  return (
    <>
      <Navbar />
      <Header />
      <Divider mt={20} mb={2} />
      <Box as={Container} maxW="7xl" mb={5} p={4}>
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
          {learnWeb3NFTs.map((nft,i) => {
            // Display the image and video


          }) 
        }

        </Grid>
      </Box>
    </>
  );

  return (
    <>
      <Navbar />
      <Header />
      <Divider mt={20} mb={2} />
      {!isLoading ? (
        <Box as={Container} maxW="7xl" mt={5} p={4}>
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
            {learnWeb3NFTs &&
              learnWeb3NFTs.map((lweb3, i) => {
                // Display image and video together for now
                isImage?.includes(lweb3) ? (
                  <DisplayLearnWeb3NFTImage key={i} nft={lweb3} />
                ) : (
                  <DisplayLearnWeb3NFTVideo key={i} nft={lweb3} />
                );
              })}
          </Grid>
          <Divider mt={12} mb={10} />
          <chakra.h3>BuildSpace nfts</chakra.h3>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            }}
            gap={{ base: "8", sm: "12", md: "16" }}
            h={20}
          >
            {bldSpaceNFTs &&
              bldSpaceNFTs.map((bld, i) => {
                // Display image and video together for now
                isImage?.includes(bld) ? (
                  <DisplayBLDSpaceNFTImage key={i} nft={bld} />
                ) : (
                  <DisplayBLDSpaceNFTVideo key={i} nft={bld} />
                );
              })}
          </Grid>
        </Box>
      ) : (
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
  console.log(walletId);

  const appolloClient = new ApolloClient({
    uri: SUBGRAPH_URL,
    cache: new InMemoryCache(),
  });
  //{users(id: "${walletId}") {
  //where: { id: "0x083fe503ea4e6319bf5fd710316124a36e13bda9" }
  const { data } = await appolloClient.query({
    query: gql`
      query getUserNFTs {
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
    `,
  });

  return {
    props: {
      users: data.users,
    },
  };
}
