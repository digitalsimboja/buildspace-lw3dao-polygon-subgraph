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
    Progress,
    VStack,
    Container,
  } from "@chakra-ui/react";
import Header from "./Header";
 
  export default function Loading() {
    return (
        <>
            <Divider mt={12} mb={12} />
            {/* Display the listing  loading state of NFT skills */}
            <Box>
              <Progress hasStripe value={64}  />
            </Box>
        </>
      );




  }