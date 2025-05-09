import { useState } from "react";
import { Contract, RpcProvider } from "starknet";
import abi from "./abi.json";

const CONTRACT_ADDRESS = "0x05f99d5d4dd479062f18dc970dc462e5ef8219cc1a80ffa75a3a7e0744c17f97";

export default function ConnectWallet() {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState({ yes: 0, no: 0 });

  const connectWallet = async () => {
    if (window.starknet) {
      await window.starknet.enable();
      setAccount(window.starknet.account.address);
    } else {
      alert("Please install ArgentX Wallet");
    }
  };

  const voteYes = async () => {
    const provider = new RpcProvider({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6",
    });
    const contract = new Contract(abi.abi, CONTRACT_ADDRESS, window.starknet.account);
    const tx = await contract.invoke("vote", [1]);
    console.log("Vote yes tx:", tx.transaction_hash);
  };

  const voteNo = async () => {
    const contract = new Contract(abi.abi, CONTRACT_ADDRESS, window.starknet.account);
    const tx = await contract.invoke("vote", [0]);
    console.log("Vote no tx:", tx.transaction_hash);
  };

  const getStatus = async () => {
    const provider = new RpcProvider({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6",
    });

    const publicContract = new Contract(abi.abi, CONTRACT_ADDRESS, provider);
    const result = await publicContract.call("get_vote_status");
    const yes = parseInt(result[0]);
    const no = parseInt(result[1]);
    setStatus({ yes, no });
  };

  return (
    <div className="p-4 text-center">
      <button onClick={connectWallet} className="bg-purple-600 text-white p-2 rounded">
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
      </button>

      <div className="my-4">
        <button onClick={voteYes} className="bg-green-500 text-white p-2 rounded mx-2">
          Vote Yes
        </button>
        <button onClick={voteNo} className="bg-red-500 text-white p-2 rounded mx-2">
          Vote No
        </button>
      </div>

      <div>
        <button onClick={getStatus} className="bg-blue-500 text-white p-2 rounded">
          Get Vote Status
        </button>
        <p className="mt-2">✅ Yes: {status.yes} | ❌ No: {status.no}</p>
      </div>
    </div>
  );
}
