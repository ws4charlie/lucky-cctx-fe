# Admin Scripts for Lucky CCTX

This directory contains administration scripts for the Lucky CCTX application.

## Setting Rewards

These scripts allow you to set rewards for the Lucky CCTX contract using your admin private key.

### Prerequisites

1. Install dependencies:
   ```
   npm install dotenv
   ```

2. Create a `.env` file:
   - Copy the `.env.template` file to `.env`
   - Add your private key to the `TEST_PK_EVM` variable (without the 0x prefix)

### Basic Usage

You can set rewards with random test data using:

```bash
npm run set-rewards
```

This will:
- Connect to the ZetaChain Athens testnet
- Verify you're the contract owner
- Generate random test reward data
- Call the `setRewards` method on the contract

### Advanced Usage

For more control, you can use the advanced script:

```bash
npm run set-rewards-advanced
```

This script supports the following options:

```
Options:
  --address <addr>     Add a winner address
  --type <type>        Reward type (0: LuckyCCTX, 1: FinalityFlash, 2: GasGhost)
  --amount <amount>    Amount in ZETA
  --add                Add this entry to the list (use after specifying address, type, and amount)
  --clear              Clear the current list
  --default            Use default test data (this is the default behavior)
```

#### Examples

Use default random data:
```bash
npm run set-rewards-advanced
```

Add custom winners:
```bash
npm run set-rewards-advanced -- --clear --address 0x123... --type 0 --amount 0.5 --add --address 0x456... --type 1 --amount 0.8 --add
```

Get help:
```bash
npm run set-rewards-advanced -- --help
```

## Troubleshooting

If you encounter any issues:

1. **Contract Owner Mismatch**: Make sure your private key corresponds to the contract owner.
2. **RPC Connection Issues**: You can set a custom RPC URL in the `.env` file.
3. **Gas Errors**: Ensure your wallet has enough ZETA to pay for gas.