import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useSWR from 'swr'
import { getTokenList } from './tokenList'
import useAddress from './useAddress'
import useTokenList from './useTokenList'

export default function useMyCaptain() {
  const address = useAddress()
  const { chain } = useParams()
  console.log('useMyCaptain', chain)
  return useSWR(['useMyCaptain', chain], fetcher, {
    revalidateOnMount: true,
    initialData: [],
  })
}

function fetcher(key, chain) {
  return Promise.all([
    getTokenList(chain),
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
    return tokens
      .map(({ reference, status }) => {
        return { ...tokenMap[reference], status }
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
