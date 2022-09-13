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
  import Navbar from "./Navbar";
  import Listing from "./Listing";
  
  import {
    BUILDSPACE_ADDRESS,
    LEARNWEB3DAOGRADUATENFT_ADDRESS,
  } from "../constants";

  export default function Loading() {

    console.log('isLoading...', 'isLoading')
    // If the NFT Data is not ready, handle loading state
      
    return (
        <>
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