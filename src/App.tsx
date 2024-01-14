import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import './App.css';

import JSONDragons from "./contracts/SoletheonDragons.json";

type ContractObject = {
  DragonContract: ethers.Contract | null,
  DragonProvider: ethers.Provider | null,
  DragonSigner: ethers.Signer | null,
  EggFee: number,
  EggAddress: string,
  mintLoaded: boolean,
}

declare let window: any;

function App() {

  useEffect(() => {
    async function listenMMAccount() {
      window.ethereum.on("accountsChanged", async function() {
        connect();
      });
    }

    listenMMAccount();
  }, []);

  const [contrState, setContrState] = useState<ContractObject>({
    DragonContract: null,
    DragonProvider: null,
    DragonSigner: null,
    EggFee: 0,
    EggAddress: "",
    mintLoaded: false,
  })

  const connect = async () => {
    if(window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.address;
      const tempContr = new ethers.Contract(JSONDragons.address, JSONDragons.abi, signer);

      const fee = await tempContr.eligable(address);

      setContrState({
        DragonContract: tempContr,
        DragonProvider: provider,
        DragonSigner: signer,
        EggFee: fee,
        EggAddress: address,
        mintLoaded: true,
      });
    } else {
      alert("No MetaMask installed!");
    }
  }

  const getFee = async () => {
    if(contrState.DragonContract != null){
      const fee: number = await contrState.DragonContract.eligable(contrState.EggAddress);

      setContrState({
        ...contrState,
        EggFee: fee,
      });
    }
  }

  const mint = async (type: number) => {
    console.log(contrState);
    if(contrState.DragonContract != null) {
      await contrState.DragonContract.mint(type, {value: ethers.parseEther(contrState.EggFee.toString())});
    }

    getFee();
  }

  return (contrState.mintLoaded ? (
      <>
        <div id='mintView' className='row p-5'>
        <span className='fs-6 text-center text-light mb-2'>{contrState.EggAddress}</span>
          <div className='col mb-1'>
            <div className='eggView'>
              <a className='btn btn-success' role='button' onClick={() => mint(0)}>mint</a>
            </div>
          </div>
          <div className='col mb-1'>
            <div className='eggView'>
              <a className='btn btn-success' role='button' onClick={() => mint(1)}>mint</a>
            </div>
          </div>
          <div className='col mb-1'>
            <div className='eggView'>
              <a className='btn btn-success' role='button' onClick={() => mint(2)}>mint</a>
            </div>
          </div>
        </div>
      </>
    ):(
      <>
        <div id='mintView' className='row p-5'>
          <a role='button' className='btn btn-success' onClick={connect}>connect wallet</a>
        </div>
      </>
    )
  )
}

export default App
