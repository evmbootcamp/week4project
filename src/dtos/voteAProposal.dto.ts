import { ApiProperty } from "@nestjs/swagger";

export class VoteAProposalDto {        
    @ApiProperty({ type: Number, required: true, default: '0' })
    proposalIndex: number;

    @ApiProperty({ type: Number, required: true, default: '25' })
    amount: number;
}