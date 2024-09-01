import { ApiProperty } from "@nestjs/swagger";

export class SelfDelegateDto {        
    @ApiProperty({ type: String, required: true, default: 'Self Address' })
    address: string;    
}