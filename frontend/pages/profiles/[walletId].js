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
import Image from "next/image";
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

  // async function handleLearnWeb3NFTs() {
  //   const lweb3 = [];
  //   learnWeb3NFTs.map(async (nft, i) => {
  //     let tokenURI = nft.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

  //     //get the metadata
  //     const metadata = await axios
  //       .get(tokenURI)
  //       .then((response) => response.data)
  //       .catch((err) => console.error(err));

  //     //Extract the image
  //     let media = await metadata.image;
  //     lweb3.push(media);
  //   });
  //   return lweb3;
  // }

  /* ======IMAGES ====*/

  const get_url_extension = ({ url }) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };
  const myLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  const NFTImage = (props) => {
    return (
      <Image
        loader={myLoader}
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
      />
    );
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
    if (users) {
      // Call the filtering functions only when users data from the subgraph becomes available
      filterLearnWeb3NFT();
      filterBLDSpaceNFT();
    } else {
      setIsLoading(true);
    }
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
          );
          data.image = imageURI;
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

  return (
    <>
      <Navbar />
      <Header />
      <Divider mt={20} mb={2} />
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
              learnWeb3NFTs.map((url, i) => {
                console.log("learnWeb3URI for display", url);
                const extension = get_url_extension(url);
                {
                  isImage.includes(extension) && (
                    <GridItem key={i}>
                      <NFTImage
                        loader={myLoader}
                        src={url}
                        width={500}
                        height={500}
                        alt="LearnWeb3Graduates Proof of Knowledge NFT"
                      />
                    </GridItem>
                  );

                  isVideo.includes(extension) && (
                    <GridItem key={i}>
                      <video
                        autoPlay
                        style={{ width: "500px", height: "500px" }}
                      >
                        <source src={url} />
                      </video>
                    </GridItem>
                  );
                }
              })}
          </Grid>
          <Divider mt={12} mb={10} />
          <chakra.h3>BuildSpace NFT</chakra.h3>
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
              bldSpaceNFTs.map((url, i) => {
                const extension = get_url_extension(url);
                {
                  isImage.includes(extension) && (
                    <GridItem key={i}>
                      <NFTImage
                        loader={myLoader}
                        boxSize="150px"
                        src={url}
                        width={500}
                        height={500}
                        alt="Buildspace NFT"
                      />
                    </GridItem>
                  );

                  isVideo.includes(extension) && (
                    <GridItem key={i}>
                      <video
                        autoPlay
                        style={{ width: "500px", height: "500px" }}
                      >
                        <source src={url} />
                      </video>
                    </GridItem>
                  );
                }
              })}
          </Grid>
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
