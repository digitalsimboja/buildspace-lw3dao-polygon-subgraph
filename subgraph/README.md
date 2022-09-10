# A subgraph for fetching NFTs owned by a Wallet Address

This subgraph is used to fetch NFTs owned by a wallet address from two  
providers - LearnWeb3DAO and BuildSpace. It can be extended to fetch  
NFTs from other multiple sources by adding another `datasource` in the
manifest.

Head over to the [Graph](https://thegraph.com/en/) protocol website to explore  
how to create new subgraphs for indexing any blockchain.

## Prerequisites

To be able to run the application successfully, you need to have [nodejs](https://github.com/nvm-sh/nvm#node-version-manager---) installed on your  
machine.

## Getting started

To get started, open The [Graph Hosted Service](https://thegraph.com/hosted-service/dashboard)
and either sign in or create a new account.

![title](./Images/thegraph-hosted-service.png)

Next, go to the dashboard and `Add subgraph`

![title]()

Configure your subgraph by filling out the information below:

- Subgraph Name - Choose a name
- Subtitle - A subgraph for querying NFTs
- Optional - the description and GITHUB URL properties

![title]()

Once the subgraph is created, we will initialize the subgraph locally using the Graph CLI.

## Initializing a new subgraph using the Graph CLI

```
npm install -g @graphprotocol/graph-cli

# or

yarn global add @graphprotocol/graph-cli
```

Once the Graph CLI has been installed you can initialize a new subgraph with the Graph CLI `init` command.

First create an empty directory and cd into the new directory

```
mkdir new_subgraph && cd new_subgraph
```

Inside the newly created directory, run Graph init

```
~/new_subgraph$ graph init
```

Complete the steps below to setup your new subgraph

- Select ethereum as the protocol when the CLI prompts you to choose
- Select hosted-service for the Product
- Enter your subgraph name that follows the format GITHUB_USERNAME/learnweb3dao-skillnft where GITHUB_USERNAME should be your Github username
- Enter subgraph for the Directory to create the subgraph in
- Select `matic` for the network
- Input the contract address of LearnWeb3GraduatesNFT contract

Here are the fields:

```
? Product for which to initialize › hosted-service
? Subgraph name › your-username/learnweb3dao-skillnft
? Directory to create the subgraph in › subgraph
? Ethereum network › matic
? Contract address › 0x1Ed25648382c2e6Da067313e5DAcb4F138Bc8b33
? Contract Name · LearnWeb3GraduatesNFT
```

Selct `y` to repeat the above for the BuildSpace contract.

This command will generate a basic subgraph based off of the contract addresses of LearnWeb3GraduatesNFT and BuildSpace passed in. By using this contract address, the CLI will initialize a few things in your project to get you started (including fetching the abis and saving them in the abis directory).

The main configuration and definition for the subgraph lives in the subgraph.yaml file. The subgraph codebase consists of a few files:

**- subgraph.yaml:** a YAML file containing the subgraph manifest

**- schema.graphql:** a GraphQL schema that defines what data is stored for your subgraph, and how to query it via GraphQL

**- AssemblyScript Mappings:** AssemblyScript code that translates from the event data in Ethereum to the entities defined in your schema (e.g. mapping.ts in this tutorial)

The entries in subgraph.yaml that we will be working with are:

**- description (optional):** a human-readable description of what the subgraph is. This description is displayed by the Graph Explorer when the subgraph is deployed to the Hosted Service.

**- repository (optional):** the URL of the repository where the subgraph manifest can be found. This is also displayed by the Graph Explorer.

**- dataSources.source:** the address of the smart contract the subgraph sources, and the abi of the smart contract to use. The address is optional; omitting it allows to index matching events from all contracts.

**- dataSources.source.startBlock (optional):** the number of the block that the data source starts indexing from. In most cases we suggest using the block in which the contract was created.

**- dataSources.mapping.entities :** the entities that the data source writes to the store. The schema for each entity is defined in the the `schema.graphql` file.

**-dataSources.mapping.abis:** one or more named ABI files for the source contract as well as any other smart contracts that you interact with from within the mappings.

**-dataSources.mapping.eventHandlers:** lists the smart contract events this subgraph reacts to and the handlers in the mapping — `./src/mapping.ts` in the example — that transform these events into entities in the store.

## Add the Entities

Add the following schema definition on the `schema.graphql` for the shape of our data model

```
type _Schema_
  @fulltext(
    name: "tokenSearch"
    language: en
    algorithm: rank
    include: [{ entity: "SkillsNft", fields: [{ name: "ownerId" }] }]
  )

type SkillsNft @entity {
 id: ID!
 owner: User!
 ownerId: String!
 tokenId: String!
 metadata: String!
 name: String!
 createdAtTimeStamp: BigInt!
 tokenValue: String
 organization: String! # Organization that issued this SkillNft or the user that created the token
}

type User @entity {
 id: ID! # User address
 skillsNft: [SkillsNft!]! @derivedFrom(field: "owner")
}
```

We added a `@derivedFrom` declaration to associate the SkillsNft to the user who owns them. This allows for **Reverse lookups**.

Run the command below to generate the entities schema locally so we can start using it for the `mappings`.

```
$ yarn codegen
```

## Update the subgraph with the mappings entities

Configure the manifest `subgraph.yaml` to replace the `entities` field with:

```
entities
- SkillsNft
- User
```

Next, update the dataSources.mapping.eventHandlers to include only the following event handlers:

For LearnWeb3DAOGraduateNFT:

```
eventHandlers:
- event: TransferSingle(indexed address,indexed address,indexed  address,uint256,uint256)
  handler: handleTransferSingle
- event: URI(string,indexed uint256)
  handler: handleURI
```

For BuildSpace, we shall use the event handler below:

```
eventHandlers:
- event: Transfer(indexed address,indexed address,indexed uint256)
  handler: handleTransfer
```

Finally, add the `startBlock` to avoid the subgraph from indexing from the `genesis block`.

```
source:
- address: "0x1Ed25648382c2e6Da067313e5DAcb4F138Bc8b33"
- abi: LearnWeb3GraduatesNFT
- startBlock: 25159561
```

Also, complete for the BuildSpace contract datasource

```
source:
- address: "0x3cd266509d127d0eac42f4474f57d0526804b44e"
- abi: BuildSpace
- startBlock: 25580240
```

## Assemblyscript mappings

Next, open `src/build-space.ts` and `src/learn-web-3-graduates-nft.ts` to write the mappings that we defined in our subgraph eventHandlers.

## Run the build

Run the `coddegen` to ensure all configurations are properly formatted and there are no errors:

```
yarn codegen
```

## Deploying the subgraph

To deploy the graph, you need to obtain your access token from the [Graph dashboard](https://thegraph.com/hosted-service/dashboard)

Copy the access token and run the following command:

```
$ graph auth
✔ Product for which to initialize · hosted-service
✔ Deploy key · ********************************

```

After successful authentication, then deploy the subgraph:

```
yarn deploy
```

Once the subgraph is deployed, you should see it show up in your dashboard:

## Querying for data

Once the subgraph is successfully deployed, you can see it show up on the subgraph `hosted service` dashboard.

Run the query below to query for users and their associated NFTs.

```

{
  users(first: 5) {
    id
    skillsNft {
      id
      name
      metadata
      organization
    }
  }
}
```

You can also use a named query a specific userId to obtain the list of skillsNfts owned like below:

```
query fetchUserSkillsNfts ($id: String!) {
  users (where: {id: $id}) { # Pass a string value of the user wallet address
    skillsNft {
      name
      metadata
      organization
    }
  }
}
```

The frontend can now extract the metadata field from the user NFTs and display the associated image.
