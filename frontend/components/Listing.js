import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { erc721ABI, useAccount, useContract, useProvider } from 'wagmi';

export default function Listing(props) {
    // State variables to hold information about the NFT
    const [imageURI, setImageURI] = useState("");
    const [name, setName] = useState("");

    // Loading state
    const [loading, setLoading] = useState(true);

    // Get the provider, the connect wallet address, the contract instane 
    // for both the LearnWeb3GraduateNFT and BuildSpace
    const provider = useProvider();
    const { address } = useAccount();
    const LearnWeb3DAOContract = useContract({
        addressOrName: props.organization,
        contractInterface: erc721ABI,
        signerOrProvider: provider,
    }); 

    
}