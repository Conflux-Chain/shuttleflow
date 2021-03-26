import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useSWR from 'swr'
import { getTokenList } from './tokenList'
import useAddress from './useAddress'
import jsonrpc from '../data/jsonrpc'
import { getIdFromSponsorInfo } from '../util/id'

export default function useMyCaptain() {
  const address = useAddress()
  const { chain } = useParams()
  console.log('useMyCaptain', chain)
  return useSWR(['useMyCaptain', chain, address], fetcher, {
    revalidateOnMount: true,
    initialData: [],
  })
}

function fetcher(key, chain, address) {
  return Promise.all([
    getTokenList(chain),
    jsonrpc('getSponsorInfo', { url: 'sponsor', params: [address] }),
    Promise.resolve([
      {
        reference: '0x08130635368aa28b217a4dfb68e1bf8dc525621c',
        status: 'done',
      },
      {
        reference: '0xd28cfec79db8d0a225767d06140aee280718ab7e',
        status: 'registering',
      },
    ]),
  ]).then(([{ tokenMap }, tokens]) => {
    console.log('tokens', tokens)

    return tokens
      .map((tokenInfo) => {
        const { status } = tokenInfo
        const pairId = getIdFromSponsorInfo(tokenInfo)
        return { ...tokenMap[pairId], status }
      })
      .sort(({ status }) => {
        if (status === 'done') {
          return 1
        } else {
          return -1
        }
      })
  })
}
