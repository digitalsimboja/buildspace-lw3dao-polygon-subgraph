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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import { SUBGRAPH_URL } from "../../constants";
import { GetStaticProps, GetStaticPaths } from "next";
import { useEffect, useState } from "react";

const DisplayBLDSpaceNFTImage = ({ nft }) => {
  return (
    <GridItem>
      <img src={nft} alt={"BuildSpace NFT"} />
    </GridItem>
  );
};

const DisplayLearnWeb3NFTImage = ({ lweb3 }) => {
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

export default function ProfileNFTs({ users }) {
  const router = useRouter();
  const walletId = router.query.walletId;

  const [learnWeb3NFTs, setLearnWeb3NFTs] = useState([]);
  const [bldSpaceNFTs, setBldSpaceNFTS] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  async function handleLearnWeb3NFTs() {
    if (users) {
      const extractedSkillNFTs = users[0]["skillNFTs"];

      // filter out the nfts
      const learnWeb3Media = extractedSkillNFTs.filter(
        (l) => l.organization === "LearnWeb3GraduatesNFT"
      );

      // Check for image or video nft
      const isImage = [".gif", ".jpg", ".jpeg", ".png"]; //you can add more
      const isVideo = [".mpg", ".mp2", ".mpeg", ".mpe", ".mpv", ".mp4"];

      // handle the tokenURI for learnWeb3NFTs
      if (learnWeb3Media) {
        // Loop over the media
        const learnWeb3NFTs = [];
        for (let i = 0; i < learnWeb3Media.length; i++) {
          let nft = learnWeb3Media[i];
          let tokenURI = nft.tokenURI.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          );
          // get the metadata
          const metadata = await axios
            .get(tokenURI)
            .then((response) => response.data);
          //Extract the image
          let media = await metadata.image;
          media = await media.replace("ipfs://", "https://ipfs.io/ipfs/");
          // Now you have the media, instead of calling setState, we populate the empty list
          learnWeb3NFTs.push(media);
        }
        return learnWeb3NFTs;
      }
    }
  }

  async function handleBLDSpaceNFTs() {
    if (users) {
      const extractedSkillNFTs = users[0]["skillNFTs"];

      // filter out the nfts

      const bldSpaceMedia = extractedSkillNFTs.filter(
        (l) => l.organization === "buildspace"
      );

      // Check for image or video nft
      const isImage = [".gif", ".jpg", ".jpeg", ".png"]; //you can add more
      const isVideo = [".mpg", ".mp2", ".mpeg", ".mpe", ".mpv", ".mp4"];

      // handle the tokenURI for learnWeb3NFTs
      if (bldSpaceMedia) {
        // Loop over the media
        const bldSpaceNFTs = [];
        for (let i = 0; i < bldSpaceMedia.length; i++) {
          let nft = bldSpaceMedia[i];
          let tokenURI = nft.tokenURI.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          );
          // get the metadata
          const metadata = await axios
            .get(tokenURI)
            .then((response) => response.data);
          //Extract the image
          let media = await metadata.image;
          media = await media.replace("ipfs://", "https://ipfs.io/ipfs/");
          // Now you have the media, instead of calling setState, we populate the empty list
          bldSpaceNFTs.push(media);
        }
        return bldSpaceNFTs;
      }
    }
  }

  useEffect(() => {
    if (router.query.walletId) {
      if (users) {
        setIsLoading(false);
      Promise.all([handleLearnWeb3NFTs(), handleBLDSpaceNFTs()])
        .then((learnWeb3NFTs, bldSpaceNFTs) => {
          setLearnWeb3NFTs(learnWeb3NFTs);
          setBldSpaceNFTS(bldSpaceNFTs);
        })
        .finally(() => setIsLoading(false));
    }
  }
  }, [users]);

  console.log('learnWeb3NFTs', learnWeb3NFTs);
  console.log('bldSpaceNFTs', learnWeb3NFTs);

  // Check for image or video nft
  const isImage = [".gif", ".jpg", ".jpeg", ".png"]; //you can add more
  const isVideo = [".mpg", ".mp2", ".mpeg", ".mpe", ".mpv", ".mp4"];

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
