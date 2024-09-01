import { Injectable } from '@nestjs/common';
import * as tokenJson from './assets/MyToken.json';
import * as tokenizedBallotJson from './assets/TokenizedBallot.json';
import { createPublicClient, http, Address, formatEther, createWalletClient, keccak256, toHex, parseEther, hexToString, bytesToString, fromHex } from 'viem';
// import { fromHex } from 'viem/utils';
// import { toUtf8String } from 'viem/utils';
import { sepolia } from 'viem/chains'; 
import { privateKeyToAccount } from 'viem/accounts';
import { MintTokenDto } from './dtos/mintToken.dto';
import { SelfDelegateDto } from './dtos/selfDelegate.dto';
import { VoteAProposalDto } from './dtos/voteAProposal.dto';



@Injectable()
export class AppService {        
  publicClient;
  account;
  MINTER_ROLE;
  walletClient;
  
  // constructor(private configService: ConfigService) {}
  constructor() {
    this.publicClient = createPublicClient({
            chain: sepolia,
            transport: http(process.env.RPC_ENDPOINT_URL),
        });

    this.account = privateKeyToAccount( process.env.PRIVATE_KEY as `0x${string}`);
    this.MINTER_ROLE = keccak256(toHex('MINTER_ROLE'));

    this.walletClient = createWalletClient({
      account: this.account,
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });
    
  }

  /*getHello(): string {
    return 'Hello World! from getHello()';
  }*/  

  getContractAddress(): Address {
    console.log('inside app.service: getContractAddress()');
    console.log('process.env.TOKEN_ADDRESS = ')
    console.log(process.env.TOKEN_ADDRESS);
    return process.env.TOKEN_ADDRESS as Address;
  }   

  async getTokenName(): Promise<string> {    
    const name = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: "name"
    });
    return name as string;
  }

  async getTotalSupply(): Promise<string> {
    console.log('total supply in getservice called');
    const totalSupplyBN = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: 'totalSupply',
    });
    const totalSupply = formatEther(totalSupplyBN as bigint);
    console.log("total-supply: ");
    console.log(totalSupply);
    return totalSupply;
  }

  async getTokenBalance(address: string): Promise<string> {
    const balanceBN = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: 'balanceOf',
      args: [address],
    });
    const balance = formatEther(balanceBN as bigint);
    return balance;
  }
 
  async getTransactionReceipt(hash: string) {
    const txReceipt = await this.publicClient.getTransactionReceipt({
      hash: hash as `0x${string}`,
    });
    
    // As BigInt is not serializable, we need to convert it to string
    const serializedReceipt = JSON.parse(
      JSON.stringify(txReceipt, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
    return serializedReceipt;
  }

  getServerWalletAddress(): string {
    return this.account.address;
  }

  async checkMinterRole(address: string): Promise<boolean> {
    const hasMinterRole = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: 'hasRole',
      args: [this.MINTER_ROLE, address],
    });

    return hasMinterRole as boolean;
  }


  async waitForTransactionSuccess(txHash: any) {
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    if (!receipt || receipt.status !== 'success') {
      throw new Error(`Transaction failed. Hash: ${txHash}`);
    }
    return receipt;
  }

  async mintTokens(body: MintTokenDto) {
    const address = body.address;
    const amount = body.amount;
    
    try {
      const mintTx = await this.walletClient.writeContract({
        address: this.getContractAddress(),
        abi: tokenJson.abi,
        functionName: 'mint',
        args: [address, parseEther(amount.toString())],
      });

      if (await this.waitForTransactionSuccess(mintTx)) {        
        return {
          result: true,
          message: `Minted tokens to ${address}`,
          transactionHash: mintTx,
        };
      } else {
        return {
          result: false,
          message: `Failed to mint tokens to ${address}`,
          transactionHash: mintTx,
        };
      }
    } catch (error) {
      console.error('Error in mintTokens:', error);
      return {
        result: false,
        message: `Error minting tokens: ${error.message}`,
      };
    }
  }


  async selfDelegate(body: SelfDelegateDto): Promise<string> {
    const selfAddress = body.address;
    console.log(`self-delegate, address: ${selfAddress}`);
    
    try {
      const selfDelegationTx = await this.walletClient.writeContract({
        address: this.getContractAddress(),
        abi: tokenJson.abi,
        functionName: 'delegate',
        args: [selfAddress],
      });

      if( await this.waitForTransactionSuccess(selfDelegationTx) ) {
        return "Self-delegation completed" ;
      } 
      else {
        return "Self-delegation Failed!!" ;
      }
      
    } catch (error) {
      console.error('Error in selfDelegate:', error);
      return `Error minting tokens: ${error.message}`;
    }
  
  }

  async getBlockNumber() {
    const targetBlockNumberBN = await this.publicClient.getBlockNumber();
    // BigInt cannot be serialized, hence format it using formatEther() function
    const targetBlockNumber = formatEther(targetBlockNumberBN as bigint)
    console.log(`targetBlockNumber: ${targetBlockNumber}`);
    return targetBlockNumber;
  }

  // vote for a proposal on the TokenizedBallot smart contract
  /*
  {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposal",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  */



  async voteForProposal(body: VoteAProposalDto): Promise<any> {
    const votingForProposalAtIndex = body.proposalIndex;
    const votingWithTokenAmount = body.amount;
    console.log('inside app.service:: voteForProposal()');

    try {
      const votingAProposalTx = await this.walletClient.writeContract({
        address: this.getTokenizedBallotContractAddress() as `0x${string}`,
        abi: tokenizedBallotJson.abi,
        functionName: 'vote',
        args: [votingForProposalAtIndex, votingWithTokenAmount]
      });

      if( await this.waitForTransactionSuccess(votingAProposalTx) ) {        
        return "Voting was successful, Well Done." ;
      } 
      else {
        return "Voting Failed!!" ;
      }
      
    } catch (error) {
      console.error('Error in voteForProposal():', error);
      return `Error voting a proposal: ${error.message}`;
    }
    
    
  }

  // returns the name of the winning proposal
  async getWinningProposal(): Promise<any> {
    console.log('fetching winning proposal');    
    try {
      const winningProposal = await this.publicClient.readContract({
        address: this.getTokenizedBallotContractAddress() as `0x${string}`,
        abi: tokenizedBallotJson.abi,
        functionName: 'winnerName',
        args: [],
      });
      
      console.log(`winningProposal in bytes: ${winningProposal}`);    
      const winningProposalName = fromHex(winningProposal, 'string').replace(/\0/g, ''); // this is working for correct utf-8      
      console.log(`winningProposalName: ${winningProposalName}`);      
      return winningProposalName;
      
    } catch (error) {
      console.error('Error decoding bytes32 in getWinningProposal:', error);
      return `Error getting Winning Proposal: ${error.message}`;
    }
  }
  

  getTokenizedBallotContractAddress(): Address {
    return process.env.TOKENIZED_BALLOT_ADDRESS as Address;
  }

} //end of class

