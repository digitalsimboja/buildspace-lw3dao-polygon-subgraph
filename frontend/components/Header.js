import {
  Box,
  chakra,
  Stack,
  Image,
  Grid,
  GridItem,
  VStack,
  Container,
} from "@chakra-ui/react";

export default function Header() {
  return (
    <Box
      rounded={"3xl"}
      as={Container}
      maxW="5xl"
      p={4}
      mb={20}
      h="150px"
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
              <Stack spacing={0} align={"center"} mb={2}>
                <chakra.h3
                  color={"white"}
                  mb={4}
                  fontSize="4xl"
                  fontWeight={"extrabold"}
                >
                  My Minted NFTS
                </chakra.h3>
              </Stack>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}
