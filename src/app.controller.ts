import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDto } from './dtos/mintToken.dto';
import { SelfDelegateDto } from './dtos/selfDelegate.dto';
import { VoteAProposalDto } from './dtos/voteAProposal.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /*
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  */

  @Get('contract-address')
   getContractAddress() {
    return { result:  this.appService.getContractAddress() };
    
  }  

  @Get('token-name')
  async getTokenName() {
    return {result: await this.appService.getTokenName()};
  }

  @Get('total-supply')
  async getTotalSupply() {
    const totalSupply = await this.appService.getTotalSupply();
    return { result: totalSupply.toString() };
  }

  @Get('token-balance/:address')
  async getTokenBalance(@Param('address') address: string) {
    const balance = await this.appService.getTokenBalance(address);
    return { result: balance.toString() };
  }

  /*
  http://localhost:3000/transaction-receipt?hash=0x44de2db0179f3807e9af7d246bbe5bac1b75f81b198577c83fad4a18ad2be0ea 
  */
  @Get('transaction-receipt')
  async getTransactionReceipt(@Query('hash') hash: string) {
    return { result: await this.appService.getTransactionReceipt(hash) };
  }

  @Get('server-wallet-address')
  getServerWalletAddress() {
    return {result: this.appService.getServerWalletAddress()};
  }

  /*
  http://localhost:3000/check-minter-role?address=0xeDa7116C16162B1EFf03D6Eed42b3F42213900f8
  */
  @Get('check-minter-role')
  async checkMinterRole(@Query('address') address: string) {
    return {result: await this.appService.checkMinterRole(address)};
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokenDto) {
    const result = await this.appService.mintTokens(body);
    return result;
     
  }


  // self-delegate to get voting power on TokenizedBallot.sol
  @Post('self-delegate')
  async selfDelegate(@Body() body: SelfDelegateDto ){
    return { result : await this.appService.selfDelegate(body) };    
  }

  @Get('target-block-number')
  async getTargetBlockNumber() {
    /*
    BEFORE self-delegate targetBlock number is: "0.000000000006608894" 
    AFTER self-delegate targetBlock number changed to: "0.000000000006608978"
    */
    const targetBlockNumber = await this.appService.getBlockNumber();
    return {result: targetBlockNumber};
  }

  
  // vote for a proposal on the TokenizedBallot smart contract
  // TokenizedBallot.sol: vote(uint256 proposal, uint256 amount)
  // 'proposal' here is the index of a proposal in public proposals array
  // 'amount' here is the number of tokens used to vote that proposal
  @Post('vote')
  async voteForProposal(@Body() body: VoteAProposalDto ) {
    return { result: await this.appService.voteForProposal(body) };
  }

  // find the winning proposal
  @Get('winning-proposal')
  async getWinningProposal() {
    const res = await this.appService.getWinningProposal();
    console.log(`res: ${res}`);
    return { result: res as string };
  }

}
