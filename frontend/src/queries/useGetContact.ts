import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {getApiUrl} from '../sanityIntegration'

export type ContactType = {
  _id: string
  address: unknown[]
  email: string
  instagram: {
    handle: string
    link: string
  }
}

const query = `
  *[_type == 'contact'][0]{
    _id,
    address,
    email,
    instagram{
      handle,
      link
    }
  }
`

const getContact = async (): Promise<{result: ContactType | null}> => {
  const response = await axios.get(getApiUrl(query))
  return response.data
}

export const useGetContact = () => {
  return useQuery({
    queryKey: ['contact'],
    queryFn: getContact,
    select: (res) => res.result,
  })
}

