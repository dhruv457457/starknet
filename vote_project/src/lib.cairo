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
