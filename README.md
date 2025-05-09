# 🗳️ Voting Smart Contract on Starknet Sepolia

This is a beginner-friendly guide to help you write, build, and deploy a basic voting contract on **Starknet Sepolia** using Cairo, Scarb, and sncast.

---

## 📦 Prerequisites

Before you begin, install the following tools:

### 🛠 Install Required Tools

#### 1. Install **Rust**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Install Scarb (Cairo Package Manager)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://download.foundry.sh/scarb/install | sh
```
Restart terminal and check:

```bash
scarb --version
```

3. Install sncast (Starknet CLI for Sepolia)
```bash
cargo install --locked --git https://github.com/software-mansion/starknet-foundry starknet-foundry --tag v0.11.0
```
Check:

```bash
sncast --version
```

🗂 Project Setup
1. Create Project Folder
```bash
mkdir starknet-vote
cd starknet-vote
```

2. Create Scarb Project
```bash
scarb new vote_project
cd vote_project
```

✍️ Cairo Contract (src/Vote.cairo)
Replace the contents of src/lib.cairo with this:

```cairo
use starknet::ContractAddress;

#[starknet::interface]
trait VoteTrait<T> {
    fn get_vote_status(self: @T) -> (u8, u8);
    fn vote(ref self: T, vote: u8);
}

#[starknet::contract]
mod Vote {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    const YES: u8 = 1_u8;
    const NO: u8 = 0_u8;

    #[storage]
    struct Storage {
        yes_votes: u8,
        no_votes: u8,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.yes_votes.write(0);
        self.no_votes.write(0);
    }

    #[abi(embed_v0)]
    impl VoteImpl of super::VoteTrait<ContractState> {
        fn get_vote_status(self: @ContractState) -> (u8, u8) {
            (self.yes_votes.read(), self.no_votes.read())
        }

        fn vote(ref self: ContractState, vote: u8) {
            assert!(vote == YES || vote == NO, "Invalid vote!");
            if vote == YES {
                self.yes_votes.write(self.yes_votes.read() + 1);
            } else {
                self.no_votes.write(self.no_votes.read() + 1);
            }
        }
    }
}
```

🧾 Scarb.toml
Update Scarb.toml:

```toml
[package]
name = "vote_project"
version = "0.1.0"
edition = "2023_10"

[dependencies]
starknet = ">=2.4.0"

[[target.starknet-contract]]
sierra = true
casm = true
```

🔨 Build the Contract
```bash
scarb build
```
After success, note the JSON file:

```bash
target/dev/vote_project_Vote.contract_class.json
```

🔐 Sepolia Account Setup
1. Create Sepolia Account
```bash
sncast account create --network=sepolia --name=sepolia
```
✅ Copy the account address and fund it via:
🔗 https://faucet.sepolia.starknet.io

2. Deploy the Account
```bash
sncast account deploy --network=sepolia --name=sepolia
```

🚀 Declare and Deploy
1. Declare the Contract
```bash
sncast --account=sepolia declare \
  --contract-name=Vote \
  --network=sepolia
```
✅ Copy the class_hash from the output.

2. Deploy the Contract
```bash
sncast --account=sepolia deploy \
  --class-hash=<PASTE_CLASS_HASH_HERE> \
  --network=sepolia
```
✅ Copy the contract_address.

🗳 Interact with the Contract
✅ Check Vote Status (Read-only)
```bash
sncast --account=sepolia call \
  --contract-address=<CONTRACT_ADDRESS> \
  --function=get_vote_status \
  --network=sepolia
```

🗳 Vote YES (1) or NO (0)
```bash
sncast --account=sepolia invoke \
  --contract-address=<CONTRACT_ADDRESS> \
  --function=vote \
  --arguments=1 \
  --network=sepolia
```

✅ Done!
You’ve just deployed and interacted with your own voting smart contract on Starknet Sepolia 🎉
Want to try more advanced voting logic? You can extend this contract with voter registration, access control, events, and much more.

📚 Resources
Cairo Language: https://book.cairo-lang.org

Starknet Docs: https://docs.starknet.io

Starknet Faucet: https://faucet.sepolia.starknet.io

---

Would you like me to generate a `.zip` of this full project with folder structure ready to go?








