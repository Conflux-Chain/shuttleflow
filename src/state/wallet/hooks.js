import { useMemo,useState } from "react";
import { useActiveWeb3React } from "../../hooks";
import { useBlockNumber } from "../application/hooks";
export function useETHBalances(address) {
  const { library, chainId } = useActiveWeb3React();
  const latestBlockNumber = useBlockNumber();
  const [balance,setBalance]=useState(0)
  useMemo(() => {
    if (!library || !chainId) return 0;
    library
      .getBalance(address)
      .then((data) => {
          setBalance(data.toString())
      })
  }, [address, latestBlockNumber]);
  console.log('data11',balance)
  return balance;
}
