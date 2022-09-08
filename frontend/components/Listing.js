import { useEffect, useState } from "react";
import { erc721ABI, useAccount, useContract, useProvider } from "wagmi";
import styles from "../styles/Listing.module.css";

export default function Listing(props) {
    // State variables to hold information about the NFT
    const [imageURI, setImageURI] = useState("");
    const [name, setName] = useState("");

    // Set loading state to true when the user visits the profile
    const [loading, setLoading] = useState(true);

    // Get the provider, the connected address, and a contract instance
    // for the NFT contract using wagmi
    const provider = useProvider();
    const { address } = useAccount();
    const ERC721Contract = useContract({
        addressOrName: props.nftAddress,
        contractInterface: erc721ABI,
        signerOrProvider: provider,
    });

    // Fetch the NFT details by resolving the token URI
    async function fetchNFTDetails() {
        try {
            // Get the token URI from contract
            let tokenURI = await ERC721Contract.tokenURI(0);
            // If it's an IPFS URI, replace it with an HTTP Gateway link
            tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            
            // Resolve the Token URI
            const metadata = await fetch(tokenURI);
            const metadataJSON = await metadata.json();

            // Extract image URI from the metadata
            let image = metadataJSON.imageUrl;
            
            // If it's an IPFS URI, replace it with an HTTP Gateway link
            image = image.replace("ipfs://", "https://ipfs.io/ipfs/");

            // Update state variables
            setName(metadataJSON.name);
            setImageURI(image);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    // Fetch the details when component is loaded
    useEffect(() => {
        fetchNFTDetails();
    }, []);

    return (
        <div>
            {loading ? (
                <span>Loading...</span>  /*insert a spinner here */
            ) : (
                <div className="styles.card">
                    <img src={imageURI} /> 
                    <div className={styles.container}>
                        <span>
                            <b>
                                {name} - #{props.tokenId}
                            </b>
                        </span>

                    </div>

                </div>
            )}
        </div>
    )

  

}