# Week 4 - Project

## Assignment Tasks - Week 4 - Group No. 5

This is a group activity for at least 3 students:

- Complete the projects together with your group.
- Create a voting dApp to cast votes, delegate, and query results on-chain.
- Request voting tokens to be minted using the API.
- **(Bonus)** Store a list of recent votes in the backend and display them on the frontend.
- **(Bonus)** Use an oracle to fetch off-chain data:
  - Use an oracle to fetch information from a data source of your preference.
  - Use the data fetched to create the proposals in the constructor of the ballot.

## Voting dApp Integration Guidelines

- Build the frontend using Scaffold ETH 2 as a base.
- Build the backend using NestJS to provide the Mint method.
  - Implement a single POST method:
    - Request voting tokens from the API.
  - Use these tokens to interact with the tokenized ballot.
  - All other interactions must be made directly on-chain.

## Date of Submission

**01-Sept-2024**

## Github Link

[https://github.com/evmbootcamp/week4project](https://github.com/evmbootcamp/week4project)

## Tasks

1. **Successfully requested voting tokens to be minted using the API**
   - [GitHub Link](https://github.com/evmbootcamp/week4project)<br>
     <img width="474" alt="Screenshot 2024-09-01 at 13 50 00" src="https://github.com/user-attachments/assets/23cd8e26-e99f-49b6-9344-f25ea306c73e"><br>
     <img width="504" alt="Screenshot 2024-09-01 at 13 53 05" src="https://github.com/user-attachments/assets/8bf521f4-b3fc-4a2f-9039-e3c98d632424"><br>

2. **Self-Delegation:** Successfully self-delegated for Voting Power<br>
   <img width="476" alt="Screenshot 2024-09-01 at 13 53 54" src="https://github.com/user-attachments/assets/de56ad68-abff-4bfd-a3fa-2ab70174f666"><br>
   <img width="474" alt="Screenshot 2024-09-01 at 13 50 00" src="https://github.com/user-attachments/assets/23cd8e26-e99f-49b6-9344-f25ea306c73e"><br>

4. **Get the TargetBlockNumber**<br>
   <img width="629" alt="Screenshot 2024-09-01 at 13 55 00" src="https://github.com/user-attachments/assets/952fef26-21fb-4608-a612-fc47d201a4c9"><br>
   <img width="499" alt="Screenshot 2024-09-01 at 13 55 33" src="https://github.com/user-attachments/assets/40ffa92f-4acd-41dc-9611-62e0b7107914"><br>

6. **Vote:** Vote for a Proposal<br>
   <img width="444" alt="Screenshot 2024-09-01 at 13 56 05" src="https://github.com/user-attachments/assets/fbb974aa-4910-4961-af7a-fd28befd330e"><br>
   <img width="444" alt="Screenshot 2024-09-01 at 13 56 27" src="https://github.com/user-attachments/assets/3617eceb-8f8d-4d87-b36c-7ad20bb90b0f"><br>

8. **Winner:** Find the winning Proposal<br>
   <img width="628" alt="Screenshot 2024-09-01 at 13 57 07" src="https://github.com/user-attachments/assets/73b600c4-a0b9-49dc-a7f0-7d5881f5320e">

* Addresses of deployed and verified smart contracts on the Sepolia test network:
https://sepolia.etherscan.io/address/0x17dd97c1d099a31b4eaa67047cdc3e8a157c4be9 (MyToken)
https://sepolia.etherscan.io/address/0x46453a33b8ad9519f1e339be22f03d071f667049 (CallOracle)
https://sepolia.etherscan.io/address/0xc09427e4f8310e0290dc93b488aaff3874be49a8 (TokenizedBallot - not verified yet)
