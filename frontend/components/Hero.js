import { Box, Heading, Container, Text, Stack } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Hero() {
  return (
    <>
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Connect your wallet
            <br />
            <Text as={"span"} color={"green.400"}>
              to view your NFT collections
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Powered by Rainbowkit Wallet Address Manager
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <ConnectButton />
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
