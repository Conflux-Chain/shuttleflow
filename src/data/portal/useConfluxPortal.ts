import { useState, useEffect } from 'react';
import useInterval from './useInterval.ts';
import SINGLE_CALL_BALANCES_ABI from './cfx-single-call-balance-checker-abi.ts';

function openHomePage() {
    window.open('https://portal.conflux-chain.org');
}

function validAddresses(addresses) {
    return Array.isArray(addresses) && addresses.length;
}

let singleCallBalanceContract =
    window.conflux &&
    window.conflux.isConfluxPortal &&
    window.confluxJS.Contract({ abi: SINGLE_CALL_BALANCES_ABI, address: '0x8f35930629fce5b5cf4cd762e71006045bfeb24d' });

function getTokensBalance(address, tokenAddresses) {
    return singleCallBalanceContract
        .balances([address], ['0x0000000000000000000000000000000000000000', ...tokenAddresses])
        .call();
}

function getBalance(address) {
    return window.conflux.send({ method: 'cfx_getBalance', params: [address, 'latest_state'] }, []);
}

function useConfluxPortal(tokenAddresses = [], interval = 0) {
    const portalInstalled = window.conflux && window.conflux.isConfluxPortal;
    if (portalInstalled) {
        window.conflux.autoRefreshOnNetworkChange = false;
        singleCallBalanceContract =
            singleCallBalanceContract ||
            window.confluxJS.Contract({
                abi: SINGLE_CALL_BALANCES_ABI,
                address: '0x8f35930629fce5b5cf4cd762e71006045bfeb24d',
            });
    }
    const [address, setAddress] = useState(portalInstalled && window.conflux.selectedAddress);
    const [chainId, setChainId] = useState(portalInstalled && window.conflux.chainId);
    const [[balance, ...tokensBalance], setTokensBalance] = useState([undefined, []]);

    const login = () => {
        if (portalInstalled) {
            window.conflux.enable().then((addresses) => validAddresses(addresses) && setAddress(addresses[0]));
        }
    };

    useInterval(
        () => {
            setChainId(window.conflux.chainId);
        },
        portalInstalled && chainId && chainId !== 'loading' ? null : 100
    );

    useInterval(
        () => getTokensBalance(address, tokenAddresses).then(setTokensBalance),
        address && singleCallBalanceContract && interval ? interval : null
    );

    useEffect(() => {
        if (!interval && address && singleCallBalanceContract)
            getTokensBalance(address, tokenAddresses).then(setTokensBalance);
    }, [address, JSON.stringify(tokenAddresses)]);

    useEffect(() => {
        if (portalInstalled) {
            const accountListener = (newAccounts) => {
                if (validAddresses(newAccounts)) {
                    setAddress(newAccounts[0]);
                } else {
                    setAddress(null);
                }
            };
            const networkListener = (chainId) => {
                setChainId(chainId);
            };
            window.conflux.on('accountsChanged', accountListener);
            window.conflux.on('networkChanged', networkListener);
            return () => {
                if (window.conflux) {
                    window.conflux.off('accountsChanged', accountListener);
                    window.conflux.off('networkChanged', networkListener);
                }
            };
        }
    }, [portalInstalled]);

    return [
        Boolean(portalInstalled),
        address,
        [balance, tokensBalance],
        chainId,
        login,
        portalInstalled ? [window.conflux, window.confluxJS] : [null, null],
    ];
}

useConfluxPortal.openHomePage = openHomePage;

export default useConfluxPortal;